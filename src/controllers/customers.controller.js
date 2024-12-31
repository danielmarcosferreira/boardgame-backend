import connection from "../database/database.js"

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customersExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);

        if (customersExists.rows.length > 0) {
            console.log("There is already a customer with that cpf");
            return res.status(409).send({ message: "CPF number already exists" });
        }

        await connection.query(`
            INSERT INTO customers ("name", "phone", "cpf", "birthday") 
            VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);

        return res.sendStatus(201)
    } catch (err) {
        console.error("Error posting games:", err);
        return res.status(422).send({ message: "Error posting new customer" })
    }
}

export async function getCustomers(req, res) {
    const { cpf, offset, limit, order } = req.query;
    const { id } = req.params;

    try {
        if (id) {
            const customerById = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

            if (customerById.rows.length === 0) {
                return res.status(404).send({ message: "Customer not found" });
            }

            const formattedCustomer = {
                ...customerById.rows[0],
                birthday: customerById.rows[0].birthday
                    ? customerById.rows[0].birthday.toISOString().split("T")[0]
                    : null,
            };

            return res.send(formattedCustomer);
        }

        let query = `SELECT * FROM customers`;
        const params = [];
        const conditions = [];

        if (cpf) {
            conditions.push(`cpf LIKE $${params.length + 1}`);
            params.push(`${cpf}%`);
        }

        if (order) {
            const allowedFields = ["name", "cpf", "id"]
            if (!allowedFields.includes(order)) {
                return res.status(400).send({ message: "Invalid order field" });
            }
            conditions.push(`ORDER BY "${order}"`);
        } else {
            conditions.push(`ORDER BY "name"`);
        }

        if (limit) {
            conditions.push(`LIMIT $${params.length + 1}`);
            params.push(limit);
        }
        if (offset) {
            conditions.push(`OFFSET $${params.length + 1}`);
            params.push(offset);
        }

        if (conditions.length > 0) {
            query += ` ${conditions.join(" ")}`;
        }

        const customers = await connection.query(query, params);

        const formattedCustomers = customers.rows.map((customer) => ({
            ...customer,
            birthday: customer.birthday
                ? customer.birthday.toISOString().split("T")[0]
                : null,
        }));

        return res.send(formattedCustomers);
    } catch (err) {
        console.error("Error getting customers:", err);
        return res.status(500).send({ message: "Error getting customers" });
    }
}

export async function putCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        if (id) {
            const updatedCustomer = await connection.query(`
                UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
                WHERE id = $5;`, [name, phone, cpf, birthday, id]);

            if (updatedCustomer.rowCount === 0) {
                return res.status(404).send({ message: "Customer not found" });
            }

            return res.sendStatus(201)
        }

    } catch (err) {
        console.error("Error getting games:", err);
        return res.status(500).send({ message: "Error updating customers" })
    }
} 