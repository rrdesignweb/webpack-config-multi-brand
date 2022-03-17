import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>This is {count} </h1>
      <button onClick={() => setCount(count + 1)}>Increase me</button>
      <button onClick={() => setCount(count - 1)}>Decrease me</button>
    </div>
  );
}
