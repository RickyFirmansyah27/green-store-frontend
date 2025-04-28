export const column_data_sales_transaction: any = [
    {
        accessorKey: 'name',
        header: () => h('div', { class: 'text-left' }, 'Name'),
        cell: ({ row }: any) => {
          const name = row.getValue('name');
          return h('div', { class: 'text-left font-medium' }, name);
        }
      },
    {
      accessorKey: 'email',
      header: () => h('div', { class: 'text-left' }, 'Email'),
      cell: ({ row }: any) => {
        const email = row.getValue('email');
        return h('div', { class: 'text-left font-medium' }, email);
      }
    },
    {
        accessorKey: 'role',
        header: () => h('div', { class: 'text-left' }, 'Role'),
        cell: ({ row }: any) => {
          const role = row.getValue('role');
          return h('div', { class: 'text-left font-medium' }, role);
        }
      },
    {
      accessorKey: 'status',
      header: () => h('div', { class: 'text-left' }, 'Status'),
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return h('div', { class: 'text-left font-medium' }, status);
      }
    },
    {
      accessorKey: 'amount',
      header: () => h('div', { class: 'text-left' }, 'Amount'),
      cell: ({ row }: any) => {
        const amount = Number.parseFloat(row.getValue('amount'));
        return h('div', { class: 'text-left font-medium' }, '$' + amount);
      }
    },
    {
      accessorKey: 'region',
      header: () => h('div', { class: 'text-left' }, 'Region'),
      cell: ({ row }: any) => {
        const region = row.getValue('region');
        return h('div', { class: 'text-left font-medium' }, region);
      }
    },
  ];