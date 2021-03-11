import * as React from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { ModelRoutedPage } from "../models/ModelRoutedPage";
import { Layout, LayoutControl } from "../components";

import Replay from "@material-ui/icons/Replay";

import green from "@material-ui/core/colors/green";
import yellow from "@material-ui/core/colors/yellow";
import blue from "@material-ui/core/colors/blue";

import purple from "@material-ui/core/colors/purple";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";

import ServiceRoller from "../services/ServiceRoller";

import {
  IconButton,
  makeStyles,
  createStyles,
  Divider,
  Button
} from "@material-ui/core";

import Hexagon from "./Hexagon";
import Rhombus from "./Rhumbus";
import Square from "./Square";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},
    die: {
      fill: "white",
      padding: theme.spacing(1),

      "& svg": {
        width: "30px",
        height: "30px"
      }
    },
    profDie: {
      fill: yellow[400]
    },
    ablDie: {
      fill: green[400]
    },
    boostDie: {
      fill: blue[200]
    },
    diffDie: {
      fill: purple[400]
    },
    chalDie: {
      fill: red[500]
    },
    setBackDie: {
      fill: grey[600]
    },
    controls: {
      padding: theme.spacing(2),
      textAlign: "center"
    }
  })
);

interface IPageRoller {}
const PageRoller = (props: ModelRoutedPage<IPageRoller>) => {
  const classes = useStyles({});

  const [ability, setAbility] = useState(0);
  const [prof, setProf] = useState(0);
  const [boost, setBoost] = useState(0);

  const [diff, setDiff] = useState(0);
  const [chall, setChall] = useState(0);
  const [setBack, setSetBack] = useState(0);
  const [rollResult, setRollResult] = useState(null);

  const peerId = usePeer();

  const onReset = () => {};
  const doRoll = () => {
    ServiceRoller.init().then(v => {
      const res = v.eval([
        ["green", ability],
        ["yellow", prof],
        ["blue", boost],
        ["purple", diff],
        ["red", chall],
        ["black", setBack]
      ]);
      setRollResult(res);
    });
  };

  const setRating = setter => rating => {
    setter(rating);
  };

  return (
    <Layout historyId={props.history.location.key} title="Roller">
      <LayoutControl>
        <IconButton onClick={onReset} color="inherit">
          <Replay />
        </IconButton>
      </LayoutControl>
      <div>
        {peerId && <div> Your ID: {peerId}</div>}
        <div>
          <PaintX
            count={6}
            fill={ability}
            fillClass={classes.ablDie}
            onClick={setRating(setAbility)}
          >
            <IconButton className={classes.die} color="inherit">
              <Rhombus />
            </IconButton>
          </PaintX>
        </div>

        <div>
          <PaintX
            count={6}
            fill={prof}
            fillClass={classes.profDie}
            onClick={setRating(setProf)}
          >
            <IconButton
              className={classes.die}
              onClick={onReset}
              color="inherit"
            >
              <Hexagon />
            </IconButton>
          </PaintX>
        </div>

        <div>
          <PaintX
            count={6}
            fill={boost}
            fillClass={classes.boostDie}
            onClick={setRating(setBoost)}
          >
            <IconButton
              className={clsx(classes.die)}
              onClick={onReset}
              color="inherit"
            >
              <Square />
            </IconButton>
          </PaintX>
        </div>

        <Divider />

        <div>
          <PaintX
            count={6}
            fill={diff}
            fillClass={classes.diffDie}
            onClick={setRating(setDiff)}
          >
            <IconButton
              className={clsx(classes.die)}
              onClick={onReset}
              color="inherit"
            >
              <Rhombus />
            </IconButton>
          </PaintX>
        </div>

        <div>
          <PaintX
            count={6}
            fill={chall}
            fillClass={classes.chalDie}
            onClick={setRating(setChall)}
          >
            <IconButton
              className={clsx(classes.die)}
              onClick={onReset}
              color="inherit"
            >
              <Hexagon />
            </IconButton>
          </PaintX>
        </div>

        <div>
          <PaintX
            count={6}
            fill={setBack}
            fillClass={classes.setBackDie}
            onClick={setRating(setSetBack)}
          >
            <IconButton
              className={clsx(classes.die)}
              onClick={onReset}
              color="inherit"
            >
              <Square />
            </IconButton>
          </PaintX>
        </div>
      </div>

      <Divider />

      <div className={classes.controls}>
        <Button variant="contained" size="small" onClick={doRoll}>
          Roll
        </Button>
      </div>

      {rollResult && (
        <>
          <Divider />

          <div>Success: {rollResult.trueSuccess}</div>
          <div>Advantage: {rollResult.trueAdvantage}</div>
          <div>Triumph: {rollResult.triumph}</div>
          <div>Despair: {rollResult.despair}</div>
        </>
      )}
    </Layout>
  );
};

const PaintX = (props: {
  count: number;
  children: React.ReactElement;
  fill?: number;
  fillClass?: string;
  onClick?: (x: number) => void;
}) => {
  return (
    <>
      {Array.from(Array(props.count)).map((v, i) =>
        React.cloneElement(props.children, {
          key: i,
          onClick: () => props.onClick(props.fill === i + 1 ? i : i + 1),
          className: clsx(props.children.props.className, {
            [props.fillClass]: i < props.fill
          })
        })
      )}
    </>
  );
};

function usePeer() {
  const [id, setid] = useState(null);
  useEffect(() => {
    //@ts-ignore
    const peer = new Peer();
    peer.on("open", setid);
  }, []);

  return id;
}

export default PageRoller;
