import clsx from 'clsx';
import t from 'prop-types';

export const StatusPill = ({ className, status }) => (
    <div
        className={clsx(
            // Mobile first styles
            'max-md:text-xs px-3 py-0.75 rounded-full border font-medium text-center',
            // Non mobile styles
            'md:py-1.25 md:min-w-32',
            // Colors
            {
                'bg-success-200 text-success-500 border-success-400':
                    status === 'Active',
                'bg-gray-200 text-gray-900 border-gray-500': status === 'Decommissioned',
            },
            className,
        )}
    >
        {status}
    </div>
);

StatusPill.propTypes = {
    status: t.oneOf(['Active', 'Decommissioned']),
};

export const StatusDot = ({ status }) => (
    <div
        className={clsx(
            // Mobile first styles
            'h-3 w-3 rounded-full border',
            // Non mobile styles
            'md:h-4 md:w-4',
            // Colors
            {
                'bg-success-200 border-success-400':
                    status === 'Active',
                'bg-gray-200 border-gray-500': status === 'Decommissioned',
            },
        )}
    />
);

StatusDot.propTypes = {
    status: t.oneOf(['Active', 'Decommissioned']),
};
