import clsx from 'clsx';
import {
  EmptyCard,
  TicketCard,
} from '../../../components/tickets/TicketCard.jsx';
import { Error } from '../../../components/states/Error.jsx';
import { Loading } from '../../../components/states/Loading.jsx';
import { TicketFilters } from '../../../components/tickets/TicketFilters.jsx';
import { PageHeading } from '../../../components/PageHeading.jsx';
import { Icon } from '../../../atoms/Icon.jsx';

export const RequestsList = ({
  listData,
  listActions,
  filters,
  setFilters,
}) => {
  const { initialized, error, loading, data, pageNumber } = listData;
  const { nextPage, previousPage, reloadPage } = listActions;

  return (
    <div className="gutter">
      <div className="max-w-screen-lg pt-1 pb-6">
        <PageHeading title="Check Status" backTo="/" className="flex-wrap">
          <TicketFilters
            type="requests"
            filters={filters}
            setFilters={setFilters}
          />
        </PageHeading>

        {initialized && (
          <>
            {error ? (
              <Error error={error} />
            ) : (
              <div className="flex-c-st gap-4 md:grid md:grid-cols-[auto_2fr_1fr_auto]">
                {/* Loading indicator if we're loading and there is no data */}
                {loading && !data && (
                  <Loading className="col-start-1 col-end-5" />
                )}

                {/* List of data */}
                {data?.length > 0 &&
                  data.map(submission => (
                    <TicketCard
                      key={submission.id}
                      submission={submission}
                      reload={reloadPage}
                    />
                  ))}

                {/* Empty message if we're not loading and there is no data*/}
                {data?.length === 0 && (
                  <EmptyCard>
                    There are no requests to show
                    {previousPage ? ' on this page' : ''}.
                  </EmptyCard>
                )}

                {(data?.length > 0 || previousPage) && (
                  <div
                    className={clsx(
                      'col-start-1 col-end-5 py-0.25 md:py-1.75 px-6 flex-cc gap-6',
                      'bg-base-100 border rounded-box md:min-h-16',
                      'max-md:sticky max-md:bottom-4 max-md:outline-2 max-md:outline-base-100',
                    )}
                  >
                    <button
                      type="button"
                      className="kbtn kbtn-ghost kbtn-lg kbtn-circle"
                      onClick={previousPage}
                      disabled={!previousPage || loading}
                    >
                      <Icon name="chevrons-left" />
                    </button>
                    {loading ? (
                      <Loading xsmall size={36} />
                    ) : (
                      <div className="font-semibold">Page {pageNumber}</div>
                    )}
                    <button
                      type="button"
                      className="kbtn kbtn-ghost kbtn-lg kbtn-circle"
                      onClick={nextPage}
                      disabled={!nextPage || loading}
                    >
                      <Icon name="chevrons-right" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
