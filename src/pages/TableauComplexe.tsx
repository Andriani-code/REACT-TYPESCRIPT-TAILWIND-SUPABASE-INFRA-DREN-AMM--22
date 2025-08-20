const TableauComplexe = () => {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "12px",
        border: "1px solid black",
      }}
    >
      <thead>
        <tr>
          <th
            rowSpan={3}
            style={{ border: "1px solid black", padding: "4px", width: "20%" }}
          >
            DESIGNATION
          </th>
          <th
            colSpan={5}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
              backgroundColor: "#ddd",
            }}
          >
            DANS L’ENCEINTE DE L’ÉTABLISSEMENT (LOI 2017-007)
          </th>
          <th
            colSpan={7}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
              backgroundColor: "#ddd",
            }}
          >
            TERRAIN TITRÉ
          </th>
          <th
            colSpan={5}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
              backgroundColor: "#ddd",
            }}
          >
            TERRAIN NON TITRÉ
          </th>
          <th
            rowSpan={3}
            style={{ border: "1px solid black", padding: "4px", width: "7%" }}
          >
            SUPERFICIE (en m²)
          </th>
          <th
            rowSpan={3}
            style={{ border: "1px solid black", padding: "4px", width: "7%" }}
          >
            LITIGIEUX <br />
            (Une partie/En totalité/Non)
          </th>
        </tr>

        <tr>
          {/* Sous-titres DANS L’ENCEINTE DE L’ÉTABLISSEMENT */}
          <th
            style={{ border: "1px solid black", padding: "4px", width: "6%" }}
          >
            MEN
          </th>
          <th
            style={{ border: "1px solid black", padding: "4px", width: "6%" }}
          >
            PERSONNE OU ORGANISME CHARGE
          </th>
          <th
            style={{ border: "1px solid black", padding: "4px", width: "6%" }}
          >
            AUTRES
          </th>
          <th colSpan={2}></th>

          {/* Sous-titres TERRAIN TITRÉ */}
          <th
            style={{ border: "1px solid black", padding: "4px", width: "4%" }}
          >
            NUMERO CADASTRE
          </th>
          <th
            colSpan={3}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
            }}
          >
            TERRAIN TITRÉ
          </th>
          <th
            colSpan={2}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
            }}
          >
            AUTRES
          </th>

          {/* Sous-titres TERRAIN NON TITRÉ */}
          <th
            colSpan={3}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
            }}
          >
            TERRAIN NATIONAL
          </th>
          <th
            colSpan={2}
            style={{
              border: "1px solid black",
              padding: "4px",
              textAlign: "center",
            }}
          >
            AUTRES
          </th>
        </tr>

        <tr>
          {/* 3e ligne pour titres plus spécifiques */}

          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>

          <th style={{ border: "1px solid black", padding: "4px" }}></th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>

          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
          <th style={{ border: "1px solid black", padding: "4px" }}>☐</th>
        </tr>
      </thead>

      <tbody>
        {[
          "TERRAIN BÂTI",
          "COUR",
          "TERRAIN DE SPORT",
          "JARDIN POTAGER SCOLAIRE",
          "TERRAIN DE REBOISEMENT",
          "TERRAIN LIBRE",
          "AUTRES",
        ].map((designation) => (
          <tr key={designation}>
            <td style={{ border: "1px solid black", padding: "4px" }}>
              {designation}
            </td>

            {/* Cases à cocher DANS L’ENCEINTE DE L’ÉTABLISSEMENT */}
            <td
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <input type="checkbox" />
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <input type="checkbox" />
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <input type="checkbox" />
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <input type="checkbox" />
            </td>
            <td
              style={{
                border: "1px solid black",
                padding: "4px",
                textAlign: "center",
              }}
            >
              <input type="checkbox" />
            </td>

            {/* Autres colonnes vides ou checkbox */}
            <td style={{ border: "1px solid black", padding: "4px" }}>
              {/* Exemple : numéro cadastral à saisir */}
              <input type="text" style={{ width: "100%" }} />
            </td>

            {[...Array(5)].map((_, i) => (
              <td
                key={i}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                <input type="checkbox" />
              </td>
            ))}

            {[...Array(5)].map((_, i) => (
              <td
                key={i + 10}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                <input type="checkbox" />
              </td>
            ))}

            <td style={{ border: "1px solid black", padding: "4px" }}>
              <input type="number" style={{ width: "100%" }} />
            </td>

            <td style={{ border: "1px solid black", padding: "4px" }}>
              <select style={{ width: "100%" }}>
                <option>Une partie</option>
                <option>En totalité</option>
                <option>Non</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableauComplexe;
