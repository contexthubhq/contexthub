'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MetricDefinition } from '@contexthub/core';
import { Check } from 'lucide-react';

const useMetricsQuery = () => {
  const metrics: MetricDefinition[] = [
    {
      id: '1',
      name: 'Customer Lifetime Value',
      description:
        'The total revenue expected from a customer over their entire relationship with the company',
      formula:
        'WITH customer_revenue AS (SELECT customer_id, SUM(amount) as total_revenue FROM transactions WHERE status = "completed" GROUP BY customer_id), customer_lifespan AS (SELECT customer_id, DATEDIFF(MAX(transaction_date), MIN(transaction_date)) as days_active FROM transactions GROUP BY customer_id) SELECT AVG(cr.total_revenue / (cl.days_active / 365.0)) as clv FROM customer_revenue cr JOIN customer_lifespan cl ON cr.customer_id = cl.customer_id',
      tags: ['revenue', 'customer', 'lifetime-value'],
      exampleQueries: [
        'SELECT AVG(clv) FROM customer_lifetime_value WHERE acquisition_date >= "2024-01-01" AND acquisition_date <= "2024-03-31"',
        'SELECT segment, acquisition_channel, AVG(clv) FROM customer_lifetime_value GROUP BY segment, acquisition_channel',
        'SELECT customer_type, AVG(clv) FROM customer_lifetime_value WHERE customer_type IN ("subscription", "one_time") GROUP BY customer_type',
        'SELECT DATE_TRUNC("month", calculation_date) as month, AVG(clv) FROM customer_lifetime_value WHERE calculation_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month',
        'SELECT AVG(clv) FROM customer_lifetime_value WHERE customer_id IN (SELECT customer_id FROM transactions GROUP BY customer_id HAVING COUNT(*) > 5)',
      ],
      unitOfMeasure: 'USD',
    },
    {
      id: '2',
      name: 'Monthly Recurring Revenue',
      description:
        'The amount of revenue that recurs monthly from subscription customers',
      formula: null,
      tags: ['revenue', 'subscription', 'monthly'],
      exampleQueries: [
        'SELECT current_month.mrr, previous_month.mrr, ((current_month.mrr - previous_month.mrr) / previous_month.mrr) * 100 as growth_rate FROM monthly_mrr current_month JOIN monthly_mrr previous_month ON current_month.month = previous_month.month + INTERVAL 1 MONTH',
        'SELECT plan_type, SUM(subscription_amount) as mrr FROM subscriptions WHERE status = "active" GROUP BY plan_type',
        'SELECT SUM(churned_mrr) as mrr_churn, SUM(expansion_mrr) as mrr_expansion FROM quarterly_mrr_changes WHERE quarter = CURRENT_QUARTER()',
      ],
      unitOfMeasure: 'USD',
    },
    {
      id: '3',
      name: 'Customer Acquisition Cost',
      description: 'The cost to acquire a new customer',
      formula:
        'SELECT (marketing_spend + sales_spend) / new_customers_acquired FROM monthly_metrics WHERE month = CURRENT_MONTH()',
      tags: ['cost', 'acquisition', 'marketing'],
      exampleQueries: [
        'SELECT marketing_channel, (marketing_spend + sales_spend) / new_customers as cac FROM customer_acquisition GROUP BY marketing_channel',
        'SELECT month, (marketing_spend + sales_spend) / new_customers as cac FROM monthly_metrics WHERE month >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH) ORDER BY month',
        'SELECT segment, AVG(cac / clv) as cac_clv_ratio FROM customer_metrics GROUP BY segment',
        'SELECT AVG(clv / cac) as payback_months FROM customer_metrics WHERE acquisition_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)',
        'SELECT campaign_type, (spend / new_customers) as cac, (revenue / spend) as efficiency FROM campaign_metrics GROUP BY campaign_type',
        'SELECT (SUM(marketing_spend) + SUM(sales_spend)) / SUM(new_customers) as blended_cac FROM monthly_metrics WHERE month = CURRENT_MONTH()',
        'SELECT customer_size, (marketing_spend + sales_spend) / new_customers as cac FROM customer_acquisition WHERE customer_size IN ("enterprise", "smb") GROUP BY customer_size',
      ],
      unitOfMeasure: 'USD',
    },
  ];
  return {
    data: {
      metrics,
    },
  };
};

export function MetricsTable() {
  const { data } = useMetricsQuery();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Formula</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Example queries</TableHead>
          <TableHead>Unit of measure</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.metrics.map((metric) => (
          <TableRow
            key={metric.id}
            onClick={() => {}}
            role="button"
            className="hover:bg-muted cursor-pointer"
          >
            <TableCell>{metric.name}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {metric.description ?? ''}
            </TableCell>
            <TableCell>
              {metric.formula ? (
                <Check className="size-4 text-muted-foreground" />
              ) : null}
            </TableCell>
            <TableCell>{metric.tags.join(', ')}</TableCell>
            <TableCell>
              {metric.exampleQueries.length > 0 ? (
                <span className="text-muted-foreground italic">
                  {metric.exampleQueries.length}{' '}
                  {metric.exampleQueries.length === 1 ? 'query' : 'queries'}
                </span>
              ) : null}
            </TableCell>
            <TableCell>{metric.unitOfMeasure ?? ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
