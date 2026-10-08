import { useAuth } from "../../context/use-auth";
import { useHover } from "../../hooks/use-hover";
import { useAccountMenu } from "../../hooks/use-account-menu";
import type { User } from "../../interface/user";
import AccountMenu from "./account-menu";

interface UserSectionProps {
  onLoginClick: () => void;
}

/** User avatar icon that toggles the account menu on click. */
function Avatar({ onClick }: { onClick: () => void }) {
  const { isHovered, hoverProps } = useHover();
  const icon = isHovered ? "account_hover" : "account_default";

  return (
    <img
      className="user-image"
      src={`./assets/icons/${icon}.png`}
      alt="Logged User"
      onClick={onClick}
      {...hoverProps}
    />
  );
}

/** Avatar plus dropdown menu for a logged-in user. */
function AccountDropdown({ user }: { user: User }) {
  const { isOpen, menuRef, close, toggle } = useAccountMenu();

  return (
    <div className="account-container" ref={menuRef}>
      <Avatar onClick={toggle} />
      {isOpen && <AccountMenu user={user} onClose={close} />}
    </div>
  );
}

/** Shows the login button or, when logged in, the account dropdown. */
function UserSection({ onLoginClick }: UserSectionProps) {
  const { loggedUser } = useAuth();

  return (
    <div className="user-section">
      {loggedUser ? (
        <AccountDropdown user={loggedUser} />
      ) : (
        <button className="login-btn" onClick={onLoginClick}>Login</button>
      )}
    </div>
  );
}

export default UserSection;