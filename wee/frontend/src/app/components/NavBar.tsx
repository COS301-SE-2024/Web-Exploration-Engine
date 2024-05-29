'use client'
import React from "react";
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
      "Home",
      "Results",
      "Profile",
      "Analytics",
      "Log Out",
    ];

    return (
        <Navbar
          isBordered
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className="bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-500 dark:text-primaryTextColor"
        >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>
  
        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>            
            <p className="font-bold text-inherit">WEE</p>
          </NavbarBrand>
        </NavbarContent>
  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <p className="font-bold text-inherit">WEE</p>
          </NavbarBrand>
          <NavbarItem>
            <Link className="text-dark-primaryTextColor dark:text-primaryTextColor" href="/home">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive>            
            <Link href="/results" aria-current="page">
              Results
            </Link>
          </NavbarItem>
        </NavbarContent>
  
        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitch/>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="warning" href="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
  
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === menuItems.length - 1 ? "danger" : "foreground"
                }
                href={`/${item.toLowerCase()}`}
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    )
}