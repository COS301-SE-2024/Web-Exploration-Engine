'use client'
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Avatar} from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import { supabase } from "../utils/supabase_service_client";
import { User } from "../models/AuthModels";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);


    const menuItems = [
      "Home",
      "Help"
      // "Profile",
      // "Analytics",
      // "Log Out",
    ];

    useEffect(() => {
      const fetchUserData = async () => {
          try {
              const { data: { user } } = await supabase.auth.getUser();
              setUser(user as unknown as User);
          } catch (error) {
              console.error("Error fetching user data:", error);
          }
      };
  
      fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
        await supabase.auth.signOut();
        setUser(null); // Update the user state to reflect the user is signed out
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

    return (
        <Navbar
          isBordered
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className="bg-jungleGreen-700 text-dark-primaryTextColor dark:bg-jungleGreen-400 dark:text-primaryTextColor"
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
            <Link className="text-dark-primaryTextColor dark:text-primaryTextColor" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem >            
            <Link href="/help" className="text-dark-primaryTextColor dark:text-primaryTextColor">
              Help
            </Link>
          </NavbarItem>
        </NavbarContent>
  
        <NavbarContent justify="end">
        <NavbarItem>
            <ThemeSwitch/>
          </NavbarItem>

          {user ? (
              <>
                  <NavbarItem className="hidden lg:flex">
                    <Avatar showFallback src='https://images.unsplash.com/broken' />
                  </NavbarItem>
                  <NavbarItem>
                      <Button as={Link}  variant="bordered" className="font-poppins-semibold text-dark-primaryTextColor dark:text-primaryTextColor border-dark-primaryTextColor dark:border-primaryTextColor"
                        onClick={handleSignOut}>
                          Log Out
                      </Button>
                  </NavbarItem>
              </>
          ) : (
              <>
                  <NavbarItem className="hidden lg:flex">
                      <Button as={Link} href="/login" variant="bordered" className="font-poppins-semibold text-dark-primaryTextColor dark:text-primaryTextColor border-dark-primaryTextColor dark:border-primaryTextColor">
                          Login
                      </Button>
                  </NavbarItem>
                  <NavbarItem>
                      <Button as={Link} href="/signup" className="font-poppins-semibold dark:text-jungleGreen-400 text-jungleGreen-700 bg-dark-primaryTextColor dark:bg-dark-primaryBackgroundColor">
                          Sign Up
                      </Button>
                  </NavbarItem>
              </>
          )}
        </NavbarContent>
  
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color="foreground"                
                href={item == 'Home' ? `/` : `/${item.toLowerCase()}`}
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