import { Suspense } from "react";

let finished = false;

function List() {
  console.log("server Render..");
  if (!finished) {
    throw Promise.all([
      new Promise(resolve => setTimeout(resolve, 5000)),
      new Promise(resolve => {
        finished = true;
        resolve("");
      }),
    ]);
  }

  return <ul>xxxxx</ul>;
}

const Coins = () => {
  return (
    <div>
      <h1>Welcome to RSC</h1>
      <Suspense fallback="Render in the Serve...">
        <List />
      </Suspense>
    </div>
  );
};

export default Coins;
