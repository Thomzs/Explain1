import {Allotment} from "allotment";
import "allotment/dist/style.css";
import React, {useState} from 'react';
import "antd/dist/antd.min.css";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {getTerritoryByName} from "../utils/api";
import TreeComponent from "./components/TreeComponent";
import {debounce} from "../utils/debounce";


const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [singleSelections, setSingleSelections] = useState(null);

  const handleSearch = (query) => {
    setIsLoading(true);

    getTerritoryByName(query)
      .then((items) => {
        setOptions(items);
        setIsLoading(false);
      })
	  .catch((err) => {
	  	alert("Une erreur s'est produite. Veuillez ressayer.");
		console.log(err);
	  });
  };

  const updateOption = debounce((e) => setSingleSelections(e), 250);

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <section className="container-fluid h-100">

      <Allotment vertical={false} className="h-100 w-100">
        <Allotment.Pane minSize={300} preferredSize={300}>
          <div className="row w-100 mt-4 ps-2">
            <AsyncTypeahead
              filterBy={filterBy}
              id="async-example"
              isLoading={isLoading}
              labelKey="name"
              minLength={3}
              onSearch={handleSearch}
              onChange={updateOption}
              options={options}
              placeholder="Recherchez une localité"
              renderMenuItemChildren={(option) => (
                  <span>{option.name} - {option.code}</span>
              )}
            />
          </div>
          <div className="row w-100 h-100 ms-2 pt-3 pb-1 overflow-scroll" data-mdb-perfect-scrollbar="true">
              <TreeComponent territory={singleSelections} key={new Date().getTime()}/>
          </div>
        </Allotment.Pane>
        <Allotment.Pane>
          <div>C'est là qu'on affiche la liste des territoires sélectionnés</div>
        </Allotment.Pane>
      </Allotment>
    </section>
  );
}

export default Search;
