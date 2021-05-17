import { ButtonGroup, Button } from "@blueprintjs/core";
import React from "react";
import { RecoilState, useRecoilValue } from "recoil";
import { ActionName } from "../Controllers/Controller";

export type DemoAction = {
  name: ActionName;
  fn: () => void;
};
export type ReactActionsProps = {
  actions: RecoilState<DemoAction[]>;
};
export const ControllerActionsView: React.FC<ReactActionsProps> = (props) => {
  const actions = useRecoilValue(props.actions);

  return (
    <ButtonGroup large>
      {actions.map(({ name, fn }) => (
        <Button onClick={fn} key={name}>
          {name}
        </Button>
      ))}
    </ButtonGroup>
  );
};
