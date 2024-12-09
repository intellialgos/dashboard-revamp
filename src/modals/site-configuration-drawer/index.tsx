import { Drawer, Form } from "antd";
import { type FC } from "react";

import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { useAppSelector } from "../../hooks/use-app-selector";
import {
  getSelectedEvents,
  getShowSiteInfoModalState
} from "../../store/selectors/events";
import {
  setSelectedEvents,
  setShowSiteInfoModal
} from "../../store/slices/events";
import { ProcessStatus } from "../../types/device-event";

import { SiteInfoListMap } from "../../components/site-info-map-list";
import styles from "./index.module.css";

type Props = {
  dataTestId?: string;
  darkTheme?:boolean
};

type Fields = {
  processStatus: ProcessStatus;
  remarks: string;
  caseNumber: string;
};

const initialValues: Fields = {
  processStatus: ProcessStatus.Accomplished,
  remarks: "",
  caseNumber: "",
};


export const SiteConfigurationDrawer: FC<Props> = ({ dataTestId,darkTheme}) => {

  const dispatch = useAppDispatch();
  const [form] = Form.useForm<Fields>();
  const show = useAppSelector(getShowSiteInfoModalState);
  const [event] = useAppSelector(getSelectedEvents);



  const handleClose = () => {
    dispatch(setShowSiteInfoModal(false));
    dispatch(setSelectedEvents([]));
  };

  return (
    <>

      <Drawer
        open={show}
        width={460}
        title="Test 1"
        destroyOnClose={true}
        onClose={handleClose}
        data-testid={dataTestId}
        style={{ background:`${darkTheme ? " #0C183B" :"" }`  }}
      >
        <div className={styles.container}>
          <>
            <SiteInfoListMap site={event?.site} darkTheme={darkTheme} />
          </>
        </div>
      </Drawer>
    </>
  );
};
