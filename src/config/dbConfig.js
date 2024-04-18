import knex from "knex"

const db = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "tododb"
    }
})

// async function createTable() {
//     try{
//         await db.schema.createTable('todos', function (table) {
//             table.increments('id').primary();
//             table.string('title');
//             table.string('description');
//             table.enum('priority', ['low', 'medium', 'high']);
//             table.enum('status', ['pending', 'completed']);
//             table.boolean('is_deleted').defaultTo(false);
//             table.timestamps(true, true);
//         });
//         console.log("Table Created Successfully")
//     }catch(err) {
//         console.log("Error!!!! Table Not Created", err)
//     }finally {
//         db.destroy();
//     }
// }

// createTable();
export default db