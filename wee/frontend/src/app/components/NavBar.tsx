'use client'
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Avatar, Tooltip} from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import { getSupabase } from "../utils/supabase_service_client";
import { useRouter } from 'next/navigation';
import { useUserContext } from "../context/UserContext";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { user, setUser } = useUserContext();
    const supabase = getSupabase();
    

    const router = useRouter();

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
              if (!user) {
                  setUser(null);
                  return;
              }
              setUser({
                  uuid: user.id,
                  emailVerified: user?.email_confirmed_at ? true : false,
              });
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
        router.push('/');
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };

  const handleHelp = () => {
    router.push('/help');
  }

  const handleHome = () => {
    router.push('/');
  }

  const handleLogin = () => {
    router.push('/login');
  }

  const handleSignup = () => {
    router.push('/signup');
  }

  const handleSavedReports = () => {  
    router.push('/savedreports');
  }

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
          <Link onClick={handleHome} className="text-dark-primaryTextColor dark:text-primaryTextColor cursor-pointer" >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem >            
          <Link onClick={handleHelp} className="text-dark-primaryTextColor dark:text-primaryTextColor cursor-pointer">
            Help
          </Link>
        </NavbarItem>
        <NavbarItem>
              {!user ? (
                  <Tooltip content="Please log in to access Saved Reports">
                      <span className="cursor-not-allowed">
                          Saved Reports
                      </span>
                  </Tooltip>
              ) : (
                  <Link onClick={handleSavedReports} className="text-dark-primaryTextColor dark:text-primaryTextColor cursor-pointer">
                      Saved Reports
                  </Link>
              )}
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
                    <Button as={Link} onClick={handleLogin} variant="bordered" className="font-poppins-semibold text-dark-primaryTextColor dark:text-primaryTextColor border-dark-primaryTextColor dark:border-primaryTextColor">
                        Login
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} onClick={handleSignup} className="font-poppins-semibold dark:text-jungleGreen-400 text-jungleGreen-700 bg-dark-primaryTextColor dark:bg-dark-primaryBackgroundColor">
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