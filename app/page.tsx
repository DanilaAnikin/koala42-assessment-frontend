"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import HierarchyTable from './components/HierarchyTable';
import exampleData from './example-data.json';
import type { DataItem } from './types';

const Home: NextPage = () => {
  // Getting the example-data.json file into a variable
  const [treeData, setTreeData] = useState<DataItem[]>(exampleData);

  const handleDelete = (id: string) => {
    const deleteItem = (items: DataItem[]): DataItem[] => {
      return items.filter(item => {
        if (item.data.ID === id) return false;

        Object.keys(item.children).forEach(key => {
          item.children[key]!.records = deleteItem(item.children[key]!.records);
        });
        return true;
      });
    };

    setTreeData(prev => deleteItem(prev));
  };

  return (
    <div className="container mx-auto p-4">
      <HierarchyTable items={treeData} onDelete={handleDelete} />
    </div>
  );
};

export default Home;
