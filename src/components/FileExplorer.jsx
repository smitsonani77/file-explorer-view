import { useState } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

function App() {
  const defaultData = {
    id: 1,
    label: "Menu",
    type: "folder",
    children: [
      {
        id: 2,
        label: "Movies",
        type: "folder",
        children: [
          {
            id: 3,
            label: "Inception.mp4",
            type: "file",
            content: "Video content or metadata for Inception movie."
          },
          {
            id: 4,
            label: "The Dark Knight.mp4",
            type: "file",
            content: "Video content or metadata for The Dark Knight movie."
          },
          {
            id: 5,
            label: "Sci-Fi",
            type: "folder",
            children: [
              {
                id: 6,
                label: "Blade Runner 2049.mp4",
                type: "file",
                content:
                  "Video content or metadata for Blade Runner 2049 movie."
              },
              {
                id: 7,
                label: "The Matrix.mp4",
                type: "file",
                content: "Video content or metadata for The Matrix movie."
              }
            ]
          }
        ]
      },
      {
        id: 8,
        label: "Books",
        type: "folder",
        children: [
          {
            id: 9,
            label: "To Kill a Mockingbird.pdf",
            type: "file",
            content: "Content of To Kill a Mockingbird book."
          },
          {
            id: 10,
            label: "1984.pdf",
            type: "file",
            content: "Content of 1984 book."
          },
          {
            id: 11,
            label: "Fiction",
            type: "folder",
            children: [
              {
                id: 12,
                label: "The Catcher in the Rye.pdf",
                type: "file",
                content: "Content of The Catcher in the Rye book."
              },
              {
                id: 13,
                label: "Brave New World.pdf",
                type: "file",
                content: "Content of Brave New World book."
              }
            ]
          }
        ]
      },
      {
        id: 14,
        label: "Music",
        type: "folder",
        children: [
          {
            id: 15,
            label: "Bohemian Rhapsody.mp3",
            type: "file",
            content: "Audio content or metadata for Bohemian Rhapsody song."
          },
          {
            id: 16,
            label: "Imagine.mp3",
            type: "file",
            content: "Audio content or metadata for Imagine song."
          },
          {
            id: 17,
            label: "Rock",
            type: "folder",
            children: [
              {
                id: 18,
                label: "Stairway to Heaven.mp3",
                type: "file",
                content:
                  "Audio content or metadata for Stairway to Heaven song."
              },
              {
                id: 19,
                label: "Hotel California.mp3",
                type: "file",
                content: "Audio content or metadata for Hotel California song."
              }
            ]
          }
        ]
      },
      {
        id: 20,
        label: "Projects",
        type: "folder",
        children: [
          {
            id: 21,
            label: "WebApp",
            type: "folder",
            children: [
              {
                id: 22,
                label: "index.html",
                type: "file",
                content:
                  "\u003C!DOCTYPE html\u003E\u003Chtml\u003E\u003Chead\u003E\u003Ctitle\u003EWebApp\u003C/title\u003E\u003C/head\u003E\u003Cbody\u003E\u003Ch1\u003EHello, World!\u003C/h1\u003E\u003C/body\u003E\u003C/html\u003E"
              },
              {
                id: 23,
                label: "app.js",
                type: "file",
                content: "console.log('WebApp JavaScript code');"
              }
            ]
          },
          {
            id: 24,
            label: "MachineLearning",
            type: "folder",
            children: [
              {
                id: 25,
                label: "model.py",
                type: "file",
                content:
                  "import numpy as np\nprint('Machine learning model code')"
              },
              {
                id: 26,
                label: "data.csv",
                type: "file",
                content: "id,name,value\n1,Sample 1,10\n2,Sample 2,15"
              }
            ]
          }
        ]
      }
    ]
  };

  const [data, setData] = useState(defaultData);
  const [selectedItem, setSelectedItem] = useState(null);

  const generateRandomString = (length = 6) =>
    Math.random()
      .toString(36)
      .slice(2, 2 + length);

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
      return {
        ...node,
        children: [...(node.children || []), newChild]
      };
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

  const addFile = () => {
    const name = generateRandomString() + ".xyz";
    const selectedNode = findNodeById(data, selectedItem);

    const targetId =
      selectedNode?.type === "file"
        ? findParentId(data, selectedItem)
        : selectedItem;

    const newFile = {
      id: Date.now(),
      label: name,
      type: "file",
      content: "Sample content for " + name
    };

    const updatedTree = addChildToNode(data, targetId, newFile);
    setData(updatedTree);
  };

  const addFolder = () => {
    const name = generateRandomString(8);
    const selectedNode = findNodeById(data, selectedItem);

    const targetId =
      selectedNode?.type === "file"
        ? findParentId(data, selectedItem)
        : selectedItem;

    const newFolder = {
      id: Date.now(),
      label: name,
      type: "folder",
      children: []
    };

    const updatedTree = addChildToNode(data, targetId, newFolder);
    setData(updatedTree);
  };

  const handleItemSelect = (event, nodeId) => {
    setSelectedItem(Number(nodeId));
  };

  const renderTreeItems = (nodes) => {
    if (!nodes) return null;
    return nodes.map((node) => (
      <TreeItem itemId={node.id} key={node.id} label={node.label}>
        {renderTreeItems(node.children)}
      </TreeItem>
    ));
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <div>
          <button onClick={addFile}>File</button>
          <button onClick={addFolder}>Folder</button>
        </div>
      </div>

      <SimpleTreeView
        selectedItems={selectedItem}
        onSelectedItemsChange={handleItemSelect}
        defaultExpandedItems={["1"]}
      >
        {renderTreeItems([data])}
      </SimpleTreeView>
    </>
  );
}

export default App;
