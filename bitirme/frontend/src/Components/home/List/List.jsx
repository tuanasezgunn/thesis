const List = ({ list }) => {
  if (!list || list.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <div className="list-container">
      {list.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default List;
