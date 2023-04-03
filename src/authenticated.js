import AuthIdleChecker from "./authenticated/auth-idle-checker";
import Autosubmit from "./authenticated/autosubmit";
import HtmlAttacher from "./general/html-attacher";

HtmlAttacher.registerObserver(new AuthIdleChecker());
HtmlAttacher.registerObserver(new Autosubmit());

export default {};
