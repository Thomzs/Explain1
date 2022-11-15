import {Tree} from "antd";
import React, {useState} from "react";
import {getTerritoryChildren, getTerritoryInfo} from "../../utils/api";
import {useEffect} from "react";

const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const TreeComponent = (props) => {
  const [treeData, setTreeData] = useState([]);

  const onLoadData = ({ key, children, id }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(async () => {
        let children = await getTerritoryChildren(id);

        setTreeData((origin) =>
          updateTreeData(origin, key, children.map((child, index) => {
            return { title: child.name, id: child.id, isLeaf: child.hasChildren !== 1, key: `${key}-${index}`}
          })));
        resolve();
      }, 1000);
    });

  useEffect(() => {
      if (props.territory !== null && props.territory.length === 1) {
        getTerritoryInfo(props.territory[0].id)
          .then(territory => setTreeData([{
            title: territory.name, key: 0, isLeaf: territory.hasChildren !== 1, id: territory.id
          }]))
      }
  }, [props.territory])

  return (
    <Tree checkable loadData={onLoadData} defaultExpandParent={false} treeData={treeData} showLine={true}
          checkStrictly={true}/>
  );
};

export default TreeComponent;
