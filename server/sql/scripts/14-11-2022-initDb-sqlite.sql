CREATE TABLE IF NOT EXISTS territory(id INTEGER PRIMARY KEY, code TEXT, name text, kind text,
    created_at DATETIME, updated_at DATETIME, is_current BOOLEAN, population INTEGER,
    official_website_url TEXT, articles_count INTEGER, admin_docs_count INTEGER,
    impacters_count INTEGER, websites_count INTEGER, sources_count INTEGER);
.mode csv
.import ./sql/csv/territories.csv territory

CREATE TABLE IF NOT EXISTS territory_parent(id PRIMARY KEY,
    child_id INTEGER,
    parent_id INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (child_id) REFERENCES territory(id),
    FOREIGN KEY (parent_id) REFERENCES territory(id)
    );
.mode csv
.import ./sql/csv/territory_parents.csv territory_parent
