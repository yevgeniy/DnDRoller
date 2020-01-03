import * as React from "react";
import { useOpenStream } from "./util/sync";

const Log = () => {
  const [log] = useOpenStream("log");
  const [mess, setmess] = React.useState(null);

  React.useEffect(() => {
    setmess(log);
  }, [log]);

  if (!mess) return null;

  return (
    <div
      onClick={() => setmess(null)}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        background: "wheat",
        padding: "2px",
        borderRadius: 3
      }}
    >
      {mess}
    </div>
  );
};

export default Log;
