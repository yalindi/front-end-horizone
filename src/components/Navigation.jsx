import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Home, Menu, Globe, X, Building2 } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";

function Navigation() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when pressing escape key
  useEffect(() => {
    function handleEscKey(event) {
      if (isMenuOpen && event.key === "Escape") {
        setIsMenuOpen(false);
        buttonRef.current?.focus(); // Return focus to menu button
      }
    }

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen]);

  // Focus management for accessibility
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const firstFocusableElement = menuRef.current.querySelector('a, button');
      firstFocusableElement?.focus();
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      buttonRef.current?.focus();
    }
  };

  return (
    <nav
      className="z-50 bg-black/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 text-white py-3 rounded-full mx-4 my-3 relative"
      aria-label="Main navigation"
    >
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
        >
          Horizone
        </Link>
        <div className="hidden md:flex space-x-6" role="menubar">
          <Link
            to="/"
            className="transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            role="menuitem"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <Home className="inline h-4 w-4 mr-1 mb-0.5" aria-hidden="true" />
            Home
          </Link>

          <Link
            to="/hotels"
            className="transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            role="menuitem"
            aria-current={location.pathname === '/hotels' ? 'page' : undefined}
          >
            <Building2 className="inline h-4 w-4 mr-1 mb-0.5" aria-hidden="true" />
            Hotels
          </Link>

          {user?.publicMetadata?.role === "admin" && (
            <Link
              to="/admin/create-hotel"
              className="transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
              role="menuitem"
            >
              Create Hotel
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs hidden md:flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
          EN
        </Button>

        <SignedOut>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs hidden md:flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <Link to="/sign-in">Log In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Link to="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>

        <SignedIn>
          <UserButton />
          <Button
            size="sm"
            asChild
            className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Link to="/account">My Account</Link>
          </Button>
        </SignedIn>

        {/* Mobile Menu Button */}
        <div className="relative md:hidden">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="relative z-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-full"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              id="mobile-menu"
              className="absolute right-0 mt-2 w-56 rounded-xl bg-black border border-gray-800 shadow-lg py-2 px-3 animate-in fade-in slide-in-from-top-5 duration-200 z-50"
              style={{ top: "calc(100% + 8px)" }}
              role="menu"
              aria-orientation="vertical"
              onKeyDown={handleMenuKeyDown}
            >
              <div className="flex flex-col space-y-3 py-2">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors rounded px-2 py-1 ${location.pathname === '/'
                    ? 'text-white bg-white/20'
                    : 'hover:text-gray-300'
                    }`}
                  role="menuitem"
                  onClick={closeMenu}
                  aria-current={location.pathname === '/' ? 'page' : undefined}
                >
                  Home
                </Link>

                <Link
                  to="/hotels"
                  className={`text-sm font-medium transition-colors rounded px-2 py-1 ${location.pathname === '/hotels'
                      ? 'text-white bg-white/20'
                      : 'hover:text-gray-300'
                    }`}
                  role="menuitem"
                  onClick={closeMenu}
                  aria-current={location.pathname === '/hotels' ? 'page' : undefined}
                >
                  Hotels
                </Link>

                {user?.publicMetadata?.role === "admin" && (
                  <Link
                    to="/admin/create-hotel"
                    className={`text-sm font-medium transition-colorsrounded px-2 py-1 ${location.pathname === '/admin/create-hotel'
                        ? 'text-white bg-white/20'
                        : 'hover:text-gray-300'
                      }`}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Create Hotel
                  </Link>
                )}

                <div className="h-px bg-white/20 my-1" aria-hidden="true"></div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  role="menuitem"
                >
                  <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
                  EN
                </Button>

                {/*SignedOut/SignedIn sections for mobile */}
                <SignedOut>
                  <Link
                    to="/sign-in"
                    className="text-sm font-medium hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                    asChild
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </SignedOut>

                <SignedIn>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                    asChild
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    <Link to="/account">My Account</Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;