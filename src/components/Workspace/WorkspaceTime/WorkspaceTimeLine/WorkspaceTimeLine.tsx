import * as PIXI from 'pixi.js';
import { FC } from 'react';
import React from 'react';

import { useTimeLineAnimations } from '../../../../hooks/useTimeLineAnimations/useTimeLineAnimations';

interface Props {
  application: PIXI.Application;
}

const WorkspaceTimeLine: FC<Props> = ({ application }) => {
  useTimeLineAnimations(application);

  return (
    <></>
  );
};

export default WorkspaceTimeLine;
