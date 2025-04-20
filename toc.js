// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">编程范式的演进和分析</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="1/index.html"><strong aria-hidden="true">1.</strong> 面向过程编程（Procedural Programming）</a></li><li class="chapter-item expanded "><a href="2/index.html"><strong aria-hidden="true">2.</strong> 面向对象编程（Object-Oriented Programming, OOP）</a></li><li class="chapter-item expanded "><a href="3/index.html"><strong aria-hidden="true">3.</strong> 函数式编程（Functional Programming, FP）</a></li><li class="chapter-item expanded "><a href="4/index.html"><strong aria-hidden="true">4.</strong> 逻辑式编程（Logic Programming）</a></li><li class="chapter-item expanded "><a href="5/index.html"><strong aria-hidden="true">5.</strong> 声明式编程（Declarative Programming）</a></li><li class="chapter-item expanded "><a href="6/index.html"><strong aria-hidden="true">6.</strong> 事件驱动编程（Event-Driven Programming, EDP）</a></li><li class="chapter-item expanded "><a href="7/index.html"><strong aria-hidden="true">7.</strong> 反应式编程（Reactive Programming, RP）</a></li><li class="chapter-item expanded "><a href="8/index.html"><strong aria-hidden="true">8.</strong> 面向方面编程（Aspect-Oriented Programming, AOP）</a></li><li class="chapter-item expanded "><a href="9/index.html"><strong aria-hidden="true">9.</strong> 数据驱动编程（Data-Driven Programming）</a></li><li class="chapter-item expanded "><a href="10/index.html"><strong aria-hidden="true">10.</strong> Actor模型（Actor Model）</a></li><li class="chapter-item expanded "><a href="11/index.html"><strong aria-hidden="true">11.</strong> 元编程（Metaprogramming）</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
