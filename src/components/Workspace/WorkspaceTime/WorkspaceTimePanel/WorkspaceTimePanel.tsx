import * as PIXI from 'pixi.js';
import { FC } from 'react';
import React from 'react';

import { useTimePanelAnimations } from '../../../../hooks/useTimePanelAnimations/useTimePanelAnimations';

interface Props {
  application: PIXI.Application;
}

const WorkspaceTimePanel: FC<Props> = ({ application }) => {
  useTimePanelAnimations(application);

  return (
    <></>
  );
};

export default WorkspaceTimePanel;
