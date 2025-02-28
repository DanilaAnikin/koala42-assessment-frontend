import { useState } from 'react';
import type { HierarchyTableProps, HierarchyRowProps } from '../types';

const HierarchyTable: React.FC<HierarchyTableProps> = ({ items, onDelete }) => {
  const headers = items.length > 0 ? Object.keys(items[0].data) : [];
  const colCount = headers.length + 1; // +1 for Actions column (Delete)

  return (
    <div className='border border-slate-100 p-2 rounded'>
      {headers.length > 0 && (
        <div
          className="grid bg-black p-2 font-bold rounded border border-gray-700"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {headers.map((header, index) => (
            <div key={index} className="text-center overflow-hidden mx-1">
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

  const hasChildren = Object.keys(item.children).some(
    key => item.children[key]!.records && item.children[key]!.records.length > 0
  );

  const toggleExpand = () => {
    if (hasChildren) setIsExpanded(!isExpanded);
  };

  const headers = Object.keys(item.data);
  const colCount = headers.length + 1;

  function formatDate(dateStr: string) {
    let parts = dateStr.split(" ");

    let month = parts[1];
    let day = parts[2];
    let year = parts[5];

    // Format is like Dec 14 1994
    return `${month} ${day} ${year}`;
  }

  return (
    <div className="my-2 rounded border border-gray-700 shadow-sm">
      <div
        className="grid bg-gray-900 p-2 items-center"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        { headers.map((header, i) => (
            <div
              key={i}
              className={`font-bold text-center overflow-hidden ${ item.children.has_nemesis ? 'cursor-pointer' : 'cursor-not-allowed' }`}
              onClick={toggleExpand}
            >
              {
                header === 'Minimal distance'
                  ? Math.round(Number(item.data[header]))
                  : header === 'Born' || header === 'In space since'
                  ? formatDate(item.data[header])
                  : item.data[header] === 'NULL'
                  ? '' : item.data[header]
              }
            </div>
          ))
        }
        <div className="text-center">
          <button
            onClick={() => onDelete(item.data.ID)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer transition-all duration-400"
          >
            Delete
          </button>
        </div>
      </div>
      { isExpanded && (
          <div className="ml-4">
            { Object.keys(item.children).map((childKey, i) => {
                const childRecords = item.children[childKey]!.records;
                const childHeaders =
                  childRecords.length > 0 ? Object.keys(childRecords[0].data) : [];
                const childColCount = childHeaders.length + 1;
                return (
                  <div key={i} className="mt-2">
                    { childRecords.length > 0 && (
                        <div
                          className="grid bg-gray-950 p-2 font-bold"
                          style={{ gridTemplateColumns: `repeat(${childColCount}, minmax(0, 1fr))` }}
                        >
                          {childHeaders.map((key, j) => (
                            <div key={j} className="text-center">
                              {key}
                            </div>
                          ))}
                          <div className="text-center">Actions</div>
                        </div>
                      )
                    }
                    { childRecords.map((childItem, idx) => (
                        <HierarchyRow key={idx} item={childItem} onDelete={onDelete} />
                      ))
                    }
                  </div>
                );
              })
            }
          </div>
        )
      }
    </div>
  );
};

export default HierarchyTable;
