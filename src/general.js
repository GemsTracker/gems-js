import './general/functions';
import Datepicker from "./general/datepicker";
import Menu from "./general/menu";
import HtmlAttacher from "./general/html-attacher";

import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/tab';

HtmlAttacher.registerObserver(new Datepicker());
HtmlAttacher.registerObserver(new Menu());

window.addEventListener('load', () => {
    HtmlAttacher.onload();
});

export default {};
