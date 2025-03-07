import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import { fetchSubmission } from '@kineticdata/react';
import { generateFormLayout } from '../../../components/forms/FormLayout.jsx';
import { KineticForm } from '../../../components/kinetic-form/KineticForm.jsx';
import useDataItem from '../../../helpers/useDataItem.js';
import { Loading } from '../../../components/states/Loading.jsx';
import { Error } from '../../../components/states/Error.jsx';
import { Button } from '../../../atoms/Button.jsx';
import { Panel } from '../../../atoms/Panel.jsx';

const generateViewParentButton = actionSubmission => () => {
  const [open, setOpen] = useState(false);

  if (!actionSubmission?.parent) return null;

  return (
    <>
      <Panel open={open} onOpenChange={({ open }) => setOpen(open)}>
        <Button slot="trigger" variant="secondary">
          View Original Request
        </Button>
        <div slot="content">
          <KineticForm
            submissionId={actionSubmission.parent.id}
            review={true}
          />
        </div>
      </Panel>
    </>
  );
};

export const ActionForm = ({ listActions: { reloadPage } }) => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.state?.backPath || '/actions';

  // Fetch the action submission
  const [actionData] = useDataItem(
    fetchSubmission,
    submissionId && [{ id: submissionId, include: 'parent' }],
    response => response.submission,
  );

  // Generate a component that renders a button to view the parent submission
  // if the action has a parent
  const ViewParentButton = useMemo(
    () => generateViewParentButton(actionData.data),
    [actionData],
  );

  // Generate the layout for the form
  const Layout = useMemo(
    () =>
      generateFormLayout({
        headingComponent: ViewParentButton,
        backTo,
      }),
    [ViewParentButton, backTo],
  );

  const handleCompleted = useCallback(() => {
    navigate(backTo);
    reloadPage();
  }, [navigate, backTo, reloadPage]);

  return actionData.data ? (
    <KineticForm
      submissionId={submissionId}
      components={{ Layout }}
      completed={handleCompleted}
      // Load the submission in review mode if it's not in Draft state
      review={actionData.data.coreState !== 'Draft'}
    />
  ) : (
    <Layout
      content={
        !actionData.error ? (
          <Loading />
        ) : (
          <Error error={actionData.error}></Error>
        )
      }
    ></Layout>
  );
};
