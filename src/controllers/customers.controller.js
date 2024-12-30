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
    const { cpf, offset, limit } = req.query;
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
                    ? customerById.rows[0].birthday.toISOString().split('T')[0]
                    : null, // Handle NULL or undefined birthday
            };

            return res.send(formattedCustomer)
        }

        if (cpf) {
            const customersByCpf = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1;`, [`${cpf}%`]);
            return res.send(customersByCpf.rows);
        }

        if (offset && limit) {
            const result = await connection.query(`
            SELECT * FROM customers ORDER BY name LIMIT $1 OFFSET $2;`, [limit, offset]);
            return res.send(result.rows);
        } else if (offset) {
            const result = await connection.query(`
            SELECT * FROM customers ORDER BY name OFFSET $1;`, [offset]);
            return res.send(result.rows);
        } else if (limit) {
            const result = await connection.query(`
            SELECT * FROM customers ORDER BY name LIMIT $1;`, [limit]);
            return res.send(result.rows);
        }

        const customers = await connection.query(`SELECT * FROM customers ORDER BY name;`);
        const formattedCustomers = customers.rows.map((customer) => ({
            ...customer,
            birthday: customer.birthday
                ? customer.birthday.toISOString().split('T')[0]
                : null, // Handle NULL or undefined birthday
        }));

        return res.send(formattedCustomers)
    } catch (err) {
        console.error("Error getting games:", err);
        return res.status(500).send({ message: "Error getting customers" })
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