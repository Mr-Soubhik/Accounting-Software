pub mod db {
    use rusqlite::{Connection, Result};

    pub fn init_db(db_path: &str) -> Result<Connection> {
        let conn = Connection::open(db_path)?;
        run_migrations(&conn)?;
        Ok(conn)
    }

    fn run_migrations(conn: &Connection) -> Result<()> {
        let schema_sql = include_str!("schema.sql");
        conn.execute_batch(schema_sql)?;
        Ok(())
    }
}
