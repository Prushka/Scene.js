"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4845],{5360:function(e,t,n){n.d(t,{Z:function(){return h}});var r=n(7294),o=n(9960),i=n(9301),c=n(6010),a="cardContainer_woeA",l="cardTitle_pNjP",s="cardDescription_qC_k",u=n(3919),d=n(5999);function m(e){var t=e.href,n=e.children;return r.createElement(o.Z,{href:t,className:(0,c.Z)("card padding--lg",a)},n)}function f(e){var t=e.href,n=e.icon,o=e.title,i=e.description;return r.createElement(m,{href:t},r.createElement("h2",{className:(0,c.Z)("text--truncate",l),title:o},n," ",o),i&&r.createElement("p",{className:(0,c.Z)("text--truncate",s),title:i},i))}function g(e){var t=e.item,n=(0,i.Wl)(t);return n?r.createElement(f,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:(0,d.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function p(e){var t,n=e.item,o=(0,u.Z)(n.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",c=(0,i.xz)(null!=(t=n.docId)?t:void 0);return r.createElement(f,{href:n.href,icon:o,title:n.label,description:null==c?void 0:c.description})}function b(e){var t=e.item;switch(t.type){case"link":return r.createElement(p,{item:t});case"category":return r.createElement(g,{item:t});default:throw new Error("unknown item type "+JSON.stringify(t))}}function h(e){var t=e.items;return r.createElement("div",{className:"row"},function(e){return e.filter((function(e){return"category"!==e.type||!!(0,i.Wl)(e)}))}(t).map((function(e,t){return r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(b,{key:t,item:e}))})))}},1072:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return u},default:function(){return p},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return f}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),c=n(5360),a=n(9301),l=["components"],s={title:"Global Config"},u=void 0,d={unversionedId:"global-config/global-config",id:"global-config/global-config",title:"Global Config",description:"",source:"@site/docs/global-config/global-config.mdx",sourceDirName:"global-config",slug:"/global-config/",permalink:"/docs/global-config/",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/global-config/global-config.mdx",tags:[],version:"current",frontMatter:{title:"Global Config"},sidebar:"tutorialSidebar",previous:{title:"Theme Interaction",permalink:"/docs/developer-interactions/theme-interaction"},next:{title:"Disable Components",permalink:"/docs/global-config/global-components/disable-components"}},m={},f=[],g={toc:f};function p(e){var t=e.components,n=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(c.Z,{items:(0,a.jA)().items,mdxType:"DocCardList"}))}p.isMDXComponent=!0}}]);