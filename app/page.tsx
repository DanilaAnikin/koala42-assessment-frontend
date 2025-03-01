"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import HierarchyTable from './components/HierarchyTable';
import { getData } from './api/getData';
import type { Character } from './types';
import type { ElementType } from './types';
import { getType } from './utils/getType';

// Recursive function to delete the element and its children elements
// (can't be same as in main branch, because this type of Characters have no "children" property, so its easier to do it like this)
const deleteRecursive = (
  list: any[],
  targetId: number,
  targetType: ElementType
): any[] =>
  list
    .map((item) => {

      const newItem = { ...item };
      if (newItem.nemeses) {
        newItem.nemeses = deleteRecursive(newItem.nemeses, targetId, targetType);
      }
      if (newItem.secrets) {
        newItem.secrets = deleteRecursive(newItem.secrets, targetId, targetType);
      }

      return newItem.id === targetId && getType(newItem) === targetType
        ? null
        : newItem;
    })
    .filter(Boolean);


const Page: NextPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    getData().then(setCharacters);
  }, []);

  const handleDelete = (item: any) => {
    setCharacters(prev => deleteRecursive(prev, item.id, getType(item)));
  };

  return (
    <div className="container mx-auto p-4">
      <HierarchyTable items={characters} onDelete={handleDelete} />
    </div>
  );
};

export default Page;
