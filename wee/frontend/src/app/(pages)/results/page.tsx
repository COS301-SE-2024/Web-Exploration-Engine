'use client';
import React from 'react';
import {Card, CardBody, Image} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import {Chip} from "@nextui-org/react";

export default function Results() {
    const list = [
        {
          title: "Orange",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$5.50",
        },
        {
          title: "Tangerine",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$3.00",
        },
        {
          title: "Raspberry",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$10.00",
        },
        {
          title: "Lemon",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$5.30",
        },
        {
          title: "Avocado",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$15.70",
        },
        {
          title: "Lemon 2",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$8.00",
        },
        {
          title: "Banana",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$7.50",
        },
        {
          title: "Watermelon",
          img: "https://nextui.org/images/breathing-app-icon.jpeg",
          price: "$12.20",
        },
    ];

    return (
        <div className='min-h-screen p-4'>
            <div className="mb-8 text-center">
                <h1 className="mt-4 font-poppins-bold text-2xl text-jungleGreen-800 dark:text-dark-primaryTextColor">
                    Results
                </h1>
            </div>

            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    General overview
                </h3>
                <Table isStriped aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>SCRAPING CATEGORY</TableColumn>
                        <TableColumn>INFORMATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell>Status</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="warning" variant="flat">Parked</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="2">
                            <TableCell>Status</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="success" variant="flat">Live</Chip>
                            </TableCell>
                        </TableRow>
                        <TableRow key="3">
                            <TableCell>Industry</TableCell>
                            <TableCell>
                                <Chip radius="sm" color="secondary" variant="flat">E-commerce</Chip>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </div>

            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Logo
                </h3>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                    <Card shadow="sm">
                        <CardBody className="overflow-visible p-0">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={"https://nextui.org/images/breathing-app-icon.jpeg"}
                                className="w-full object-cover h-[140px]"
                                src={"https://nextui.org/images/breathing-app-icon.jpeg"}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>
            
            <div className='py-3'>
                <h3 className="font-poppins-semibold text-lg text-jungleGreen-700 dark:text-jungleGreen-100 pb-2">
                    Images
                </h3>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                    {list.map((item, index) => (
                        <Card shadow="sm" key={index} >
                            <CardBody className="overflow-visible p-0">
                                <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt={item.title}
                                    className="w-full object-cover h-[140px]"
                                    src={item.img}
                                />
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}