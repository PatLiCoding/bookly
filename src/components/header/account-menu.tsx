import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/use-auth";
import type { User } from "../../interface/user";

interface CloseProps {
  onClose: () => void;
}

interface MenuItemProps extends CloseProps {
  label: string;
  path: string;
}

const MENU_ITEMS = [
  { label: "Profil", path: "/profil" },
  { label: "Bestellungen", path: "/order" },
  { label: "Bewertungen", path: "/reviews" },

];

const ADMIN_ITEM = { label: "Admin", path: "/admin" };

/** Standard menu entries, plus the admin entry for admins. */
function getMenuItems(user: User) {
  return user.role === "admin" ? [...MENU_ITEMS, ADMIN_ITEM] : MENU_ITEMS;
}

/** First and last name of the logged-in user. */
function AccountMenuName({ user }: { user: User }) {
  return (
    <div className="account-menu-name">
      <span className="account-menu-firstname">{user.Firstname}</span>
      <span className="account-menu-lastname">{user.Lastname}</span>
    </div>
  );
}

/** Menu entry that navigates to a page and closes the menu. */
function MenuItem({ label, path, onClose }: MenuItemProps) {
  const navigate = useNavigate();

  function handleClick() {
    onClose();
    navigate(path);
  }

  return (
    <button className="account-menu-item" onClick={handleClick}>
      {label}
    </button>
  );
}

/** Menu entry that logs out the active user and closes the menu. */
function LogoutButton({ onClose }: CloseProps) {
  const { logout } = useAuth();

  function handleClick() {
    logout();
    onClose();
  }

  return (
    <button className="account-menu-item logout" onClick={handleClick}>
      Ausloggen
    </button>
  );
}

/** Dropdown with the user's name, navigation entries and logout. */
function AccountMenu({ user, onClose }: CloseProps & { user: User }) {return (
    <div className="account-menu">
      <AccountMenuName user={user} />
      {getMenuItems(user).map((item) => (
        <MenuItem key={item.path} {...item} onClose={onClose} />
      ))}
      <LogoutButton onClose={onClose} />
    </div>
  );
}

export default AccountMenu;