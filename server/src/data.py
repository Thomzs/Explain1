import sqlite3


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class Database(object):
    DB_LOCATION = "explain.sqlite"

    def __init__(self):
        try:
            self._connection = sqlite3.connect(self.DB_LOCATION, check_same_thread=False)
            self._connection.row_factory = sqlite3.Row
            self._cur = self._connection.cursor()
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            raise

    def get_territory_info(self, territory_id):
        try:
            res = self._cur.execute("SELECT territory.*, \
            EXISTS(SELECT 1 FROM territory_parent WHERE parent_id = territory.id) AS hasChildren \
            FROM territory WHERE id = ?", [territory_id])
            data = dict(res.fetchone())
            return data
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            raise

    def get_territory_children(self, territory_id):
        """Tous les territoires enfants en respectant la hiérarchie. Pour les départements, on ne prend que les communes
        qui ne sont enfant d'aucun EPIC"""
        try:
            res = self._cur.execute("SELECT mainTerritory.*, \
            EXISTS(SELECT 1 FROM territory_parent WHERE parent_id = mainTerritory.id) AS hasChildren, \
            (SELECT kind FROM territory WHERE id = ?) AS parentKind \
            FROM territory AS mainTerritory \
            JOIN territory_parent ON mainTerritory.id = territory_parent.child_id \
            WHERE parent_id = ? \
            AND CASE \
                WHEN parentKind = 'FRPAYS' THEN mainTerritory.kind = 'FRREGI' \
                WHEN parentKind = 'FRREGI' THEN mainTerritory.kind = 'FRDEPA' \
                WHEN parentKind = 'FRDEPA' THEN (mainTerritory.kind = 'FREPCI' \
                   OR (mainTerritory.kind = 'FRCOMM' \
                           AND NOT EXISTS(SELECT 1 FROM territory_parent tp \
                               JOIN territory t on t.id = tp.parent_id \
                                    WHERE t.kind == 'FREPCI' AND tp.child_id = mainTerritory.id \
                               ) \
                       ) \
                   OR mainTerritory.kind = 'FRCANT') \
                WHEN parentKind = 'FREPCI' THEN mainTerritory.kind = 'FRCOMM' \
            END \
            ORDER BY mainTerritory.name;", [territory_id, territory_id])
            data = [dict(row) for row in res.fetchall()]
            return data
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            raise

    def search_territory_by_name(self, territory_name):
        try:
            res = self._cur.execute("SELECT territory.id, territory.name, territory.code \
            from territory \
                JOIN territory_parent ON territory.id = territory_parent.child_id \
            WHERE lower(name) like ? ORDER BY territory.name", [f'{territory_name.lower()}%'])
            data = [dict(row) for row in res.fetchall()]
            return data
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            raise
