import { useState } from 'react';
import type { Character, ElementType, Nemesis, Secret } from '../types';

interface HierarchyTableProps {
  items: Character[];
  onDelete: (item: any) => void;
}

interface HierarchyRowProps {
  item: Character | Nemesis | Secret;
  onDelete: (item: any) => void;
}

const HierarchyTable: React.FC<HierarchyTableProps> = ({ items, onDelete }) => {
  const headers =
    items.length > 0 ? Object.keys(items[0]).filter(key => key !== 'nemeses') : [];
  const colCount = headers.length + 2;

  return (
    <div className="border border-slate-100 p-2 rounded">
      {headers.length > 0 && (
        <div
          className="grid bg-black p-2 font-bold rounded border border-gray-700"
          style={{ gridTemplateColumns: `minmax(0, 30px) repeat(${headers.length}, minmax(0, 1fr))  minmax(0, 100px)` }}
        >
          <div></div>
          {headers.map((header, index) => (
            <div key={index} className="text-center break-all mx-1">
              {header}
            </div>
          ))}
          <div className="text-center">Actions</div>
        </div>
      )}
      {items.map((item, index) => (
        <HierarchyRow key={index} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};

const HierarchyRow: React.FC<HierarchyRowProps> = ({ item, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasNested =
    'nemeses' in item ? item.nemeses.length > 0 :
    'secrets' in item ? item.secrets.length > 0 : false;

  const toggleExpand = () => {
    if (hasNested) setIsExpanded(!isExpanded);
  };

  let headers: string[] = [];
  if ('name' in item) {
    headers = Object.keys(item).filter(key => key !== 'nemeses');
  } else if ('years' in item) {
    headers = Object.keys(item).filter(key => key !== 'secrets');
  } else {
    headers = Object.keys(item);
  }
  const colCount = headers.length + 2;

  function formatDate(dateStr: string) {
    let date = dateStr.split(" ");
    let parts = date[0].split('-');

    let month = parts[2];
    let day = parts[1];
    let year = parts[0];

    // Format is like dd/mm/yyyy
    return `${month}/${day}/${year}`;
  }

  // Icons as strings in parent el., which have child el.
  const icon = hasNested ? (isExpanded ? '▼' : '▶') : '';

  return (
    <div className="my-2 rounded border border-gray-700 shadow-sm">
      <div
        className={`grid bg-gray-900 p-2 items-center ${ hasNested ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        style={{ gridTemplateColumns: `minmax(0, 30px) repeat(${headers.length}, minmax(0, 1fr))  minmax(0, 100px)` }}
        onClick={toggleExpand}
      >
        <div className="text-center">{icon}</div>
        {headers.map((header, i) => {
          let value = (item as any)[header];
          if (value === 'NULL') {
            value = '';
          } else if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }
          if (
            (header === 'born' || header === 'inSpaceSince') &&
            typeof value === 'string'
          ) {
            value = formatDate(value);
          } else if (header.toLowerCase() === 'minimaldistance') {
            value = Math.round(Number(value));
          }
          if (value && header === 'gender' && value.toLowerCase() === 'm') {
            value = 'male';
          } else if (value && header === 'gender' && value.toLowerCase() === 'f') {
            value = 'female';
          }
          return (
            <div key={i} className="font-bold text-center break-all">
              {value}
            </div>
          );
        })}
        <div className="text-center">
          {'id' in item && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item as any);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer transition-all duration-400"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4">
          {'nemeses' in item && item.nemeses.length > 0 && (
            <div>
              <div
                className="grid bg-black p-2 font-bold rounded border border-gray-700"
                style={{
                  gridTemplateColumns: `minmax(0, 30px) repeat(${Object.keys(item.nemeses[0]).filter(key => key !== 'secrets').length}, minmax(0, 1fr))  minmax(0, 100px)`
                }}
              >
                <div></div>
                {Object.keys(item.nemeses[0])
                  .filter(key => key !== 'secrets')
                  .map((key, idx) => (
                    <div key={idx} className="text-center break-all mx-1">
                      {key}
                    </div>
                  ))}
                <div className="text-center">Actions</div>
              </div>
              {item.nemeses.map((nemesis, idx) => (
                <HierarchyRow key={idx} item={nemesis} onDelete={onDelete} />
              ))}
            </div>
          )}
          {'secrets' in item && item.secrets.length > 0 && (
            <div>
              <div
                className="grid bg-black p-2 font-bold rounded border border-gray-700"
                style={{
                  gridTemplateColumns: `minmax(0, 30px) repeat(${Object.keys(item.secrets[0]).length}, minmax(0, 1fr))  minmax(0, 100px)`
                }}
              >
                <div></div>
                {Object.keys(item.secrets[0]).map((key, idx) => (
                  <div key={idx} className="text-center break-all mx-1">
                    {key}
                  </div>
                ))}
                <div className="text-center">Actions</div>
              </div>
              {item.secrets.map((secret, idx) => (
                <HierarchyRow key={idx} item={secret} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HierarchyTable;
