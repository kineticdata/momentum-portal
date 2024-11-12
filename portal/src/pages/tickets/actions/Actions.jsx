import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { defineKqlQuery, searchSubmissions } from '@kineticdata/react';
import { ActionsList } from './ActionsList.jsx';
import { ActionForm } from './ActionForm.jsx';
import useDataList from '../../../helpers/useDataList.js';
import { useMemo, useState } from 'react';

const buildActionsSearch = (profile, filters) => {
  // Start query builder
  const search = defineKqlQuery();
  // Limit form types
  search.in('type', 'types');
  // Add core state query if filtering by either status
  if (filters.status.open || filters.status.closed) {
    search.in('coreState', 'statuses');
  }
  // Add assignment query, making sure at least one part is always included
  search.or();
  if (filters.assignment.mine || !filters.assignment.teams) {
    // If mine is checked, or if none are checked, search by individual
    search.equals('values[Assigned Individual]', 'username');
  }
  if (filters.assignment.teams || !filters.assignment.mine) {
    // If teams is checked, or if none are checked, search by my teams
    search.in('values[Assigned Team]', 'teams');
  }
  // End or block
  search.end();
  // End query builder
  search.end();

  return {
    q: search.end()({
      types: ['Approval', 'Task'],
      statuses: [
        filters.status.open && 'Draft',
        filters.status.closed && 'Submitted',
        filters.status.closed && 'Closed',
      ].filter(Boolean),
      username: profile.username,
      teams: profile.memberships.map(({ team }) => team.name),
    }),
    include: ['details', 'values', 'form', 'form.attributesMap'],
    limit: 10,
  };
};

export const Actions = () => {
  const { profile, kappSlug } = useSelector(state => state.app);

  // State for filters
  const [filters, setFilters] = useState({
    status: { open: false, closed: false },
    assignment: { mine: false, teams: false },
  });

  // Search object based on the current filters
  const search = useMemo(
    () => buildActionsSearch(profile, filters),
    [profile, filters],
  );

  // Retrieve the actions list data
  const [listData, listActions] = useDataList(
    searchSubmissions,
    [{ kapp: kappSlug, search }],
    ({ submissions }) => submissions,
  );

  return (
    <Routes>
      <Route
        path=":submissionId"
        element={<ActionForm listActions={listActions} />}
      />
      <Route
        path="*"
        element={
          <ActionsList
            listData={listData}
            listActions={listActions}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </Routes>
  );
};
