'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import JSONPretty from 'react-json-pretty';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Entry = {
    timestamp: string
    request: {
        method: string
        pathname: string
        body: string
        headers: Record<string, string>
    }
}

import data from "../../../logs/api_logs.json"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const apiData = data["entries"].reverse() as Entry[];

const columns: ColumnDef<Entry>[] = [
    {
        header: "Timestamp",
        accessorKey: "timestamp",
        cell: ({ cell }) => {
            // value is the result of a Date.now().toString() call
            const value = cell.getValue() as string;
            const date = new Date(parseInt(value));

            return (
                <div>
                    {date.toISOString()}
                </div>
            )
        }
    },
    {
        header: "Method",
        accessorKey: "request.method",
    },
    {
        header: "Pathname",
        accessorKey: "request.pathname",
    },
    {
        header: "Body",
        accessorKey: "request.body",
        cell: ({ cell }) => {
            const value = JSON.parse(cell.getValue() as string);

            return (
                <div>
                    <JSONPretty data={value} theme={{
                        main: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                        error: 'line-height:1.3;color:#499BAB;background:#FFFFFF;overflow:auto;',
                        key: 'color:#AB685B;',
                        string: 'color:#41AB82;',
                        value: 'color:#526DAB;',
                        boolean: 'color:#AB685B;',
                    }}></JSONPretty>
                </div>
            )
        }
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return (<div>
                <Link href={`/dev/api/entry/${row.id}`}>
                    <Button variant="outline">View</Button>
                </Link>
            </div>)
        }
    }
]


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default function App() {

    return (
        <div>
            <DataTable columns={columns} data={apiData} />
        </div>
    )
}