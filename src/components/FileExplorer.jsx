import { useState, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { FileIcon, FolderPlus, FilePlus, Folder } from "lucide-react";
import { getDefaultTreeData } from "../services/dataService";

function App() {
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const tree = getDefaultTreeData();
      setData(tree);
      setLoading(false);
    };
    fetchData();
  }, []);

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentId = (node, childId, parentId = null) => {
    if (node.id === childId) return parentId;
    if (node.children) {
      for (const child of node.children) {
        const found = findParentId(child, childId, node.id);
        if (found) return found;
      }
    }
    return null;
  };

  const addChildToNode = (node, id, newChild) => {
    if (node.id === id) {
      return { ...node, children: [...(node.children || []), newChild] };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) =>
          addChildToNode(child, id, newChild)
        )
      };
    }
    return node;
  };

  const handleCreate = (type) => {
    if (!selectedItem) {
      alert("Please select a folder or file first.");
      return;
    }

    const selectedNode = findNodeById(data, selectedItem);
    const targetId =
      selectedNode?.type === "file"
        ? findParentId(data, selectedItem)
        : selectedItem;
    setCreating({ type, parentId: targetId });
    setNewName("");
  };

  const handleSave = () => {
    if (!newName.trim()) {
      setCreating(null);
      return;
    }

    const newItem = {
      id: Date.now(),
      label: newName.trim(),
      type: creating.type,
      ...(creating.type === "folder" ? { children: [] } : {})
    };

    const updatedTree = addChildToNode(data, creating.parentId, newItem);
    setData(updatedTree);
    setCreating(null);
  };

  const handleItemSelect = (event, nodeId) => {
    setSelectedItem(Number(nodeId));
  };

  const renderTreeItems = (nodes) =>
    nodes?.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <div className="flex items-center gap-2">
            {node.type === "folder" ? (
              <Folder className="w-4 h-4 text-gray-700" />
            ) : (
              <FileIcon className="w-4 h-4 text-gray-700" />
            )}
            <span>{node.label}</span>
          </div>
        }
      >
        {renderTreeItems(node.children)}

        {creating && creating.parentId === node.id && (
          <div className="ml-6 flex items-center gap-2">
            {creating.type === "folder" ? (
              <Folder className="w-4 h-4 text-gray-600" />
            ) : (
              <FileIcon className="w-4 h-4 text-gray-600" />
            )}
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setCreating(null);
                }
              }}
              onKeyUp={(e) => {
                e.stopPropagation();
              }}
              onKeyPress={(e) => {
                e.stopPropagation();
              }}
              onBlur={(e) => {
                e.preventDefault();
                handleSave();
              }}
              placeholder={`New ${creating.type} name`}
              className="border border-gray-300 rounded px-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        )}
      </TreeItem>
    ));

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading tree data...
      </div>
    );

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex gap-2">
          <button
            onClick={() => handleCreate("file")}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition hover:bg-blue-700 active:scale-95"
          >
            <FilePlus size={16} /> Add File
          </button>
          <button
            onClick={() => handleCreate("folder")}
            className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition hover:bg-green-700 active:scale-95"
          >
            <FolderPlus size={16} /> Add Folder
          </button>
        </div>
      </div>

      <div className="p-3">
        <SimpleTreeView
          selectedItems={selectedItem}
          onSelectedItemsChange={handleItemSelect}
          defaultExpandedItems={["1"]}
        >
          {renderTreeItems([data])}
        </SimpleTreeView>
      </div>
    </div>
  );
}

export default App;
