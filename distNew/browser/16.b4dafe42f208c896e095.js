(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{Pwtk:function(l,n,e){"use strict";e.r(n);var t=e("CcnG"),u=e("gIcY"),a=e("AytR"),o=e("JdUQ"),i=e("9btv"),r=e("JEjJ"),d=e("hcdD"),s=e("fsFK"),c=function(){function l(l,n,e,t,u,o,i,r,d){this._fb=l,this.activatedRoute=n,this.alertService=e,this.metaService=t,this.router=u,this.ssrService=o,this.userDataService=i,this.location=r,this.routingStateService=d,this.env=a.a,this.translations=[],this.pageStatus="default",this.translations=this.activatedRoute.snapshot.data.langResolvedData,this.metaService.setData({page:this.translations.support.title,title:this.translations.support.title,description:this.translations.support.description,keywords:this.translations.support.description,url:this.env.url+"/",image:this.env.url+"assets/images/image_color.png"}),this.userDataService.analytics("support",this.translations.support.title,null)}return l.prototype.ngOnInit=function(){this.actionForm=this._fb.group({email:["",[u.r.required,u.r.pattern(this.env.emailPattern)]],content:["",[u.r.required]]})},l.prototype.goBack=function(){this.routingStateService.getPreviousUrl()},l.prototype.verifyReCaptcha=function(l){this.recaptcha=!!l},l.prototype.submit=function(l){var n=this;if(this.submitLoading=!0,this.email=this.actionForm.get("email").value,this.env.emailPattern.test(this.actionForm.get("email").value)&&this.actionForm.get("content").value.trim().length>0&&this.recaptcha){var e={email:this.actionForm.get("email").value,content:this.actionForm.get("content").value};this.userDataService.supportQuestion(e).subscribe(function(l){n.submitLoading=!1,n.pageStatus="completed"},function(l){n.submitLoading=!1,n.alertService.error(n.translations.common.emailNotExist),n.recaptcha=!1})}else this.submitLoading=!1,this.alertService.error(this.translations.common.completeAllFields)},l}(),p=function(){return function(){}}(),m=e("pMnS"),v=e("NvT6"),f=e("Blfk"),g=e("dWZg"),h=e("Ip0R"),b=e("wFw1"),_=e("dJrM"),C=e("seP3"),R=e("Wf4p"),x=e("Fzqc"),w=e("b716"),y=e("/VYK"),S=e("8Ueg"),F=e("15PL"),T=e("p4DR"),q=e("wrqk"),E=e("bujt"),I=e("UodH"),N=e("lLAP"),L=e("ZYCi"),k=t["\u0275crt"]({encapsulation:2,styles:[],data:{}});function A(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"mat-progress-spinner",[["class","mat-progress-spinner"],["mode","indeterminate"],["role","progressbar"]],[[2,"_mat-animation-noopable",null],[4,"width","px"],[4,"height","px"],[1,"aria-valuemin",0],[1,"aria-valuemax",0],[1,"aria-valuenow",0],[1,"mode",0]],null,null,v.b,v.a)),t["\u0275did"](1,49152,null,0,f.b,[t.ElementRef,g.a,[2,h.DOCUMENT],[2,b.a],f.a],{mode:[0,"mode"]},null)],function(l,n){l(n,1,0,"indeterminate")},function(l,n){l(n,0,0,t["\u0275nov"](n,1)._noopAnimations,t["\u0275nov"](n,1).diameter,t["\u0275nov"](n,1).diameter,"determinate"===t["\u0275nov"](n,1).mode?0:null,"determinate"===t["\u0275nov"](n,1).mode?100:null,t["\u0275nov"](n,1).value,t["\u0275nov"](n,1).mode)})}function P(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,66,"span",[],null,null,null,null,null)),(l()(),t["\u0275eld"](1,0,null,null,6,"div",[["class","context"]],null,null,null,null,null)),(l()(),t["\u0275ted"](2,null,[" "," "])),(l()(),t["\u0275eld"](3,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t["\u0275eld"](4,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t["\u0275ted"](5,null,[" "," "])),(l()(),t["\u0275eld"](6,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t["\u0275ted"](7,null,[" "," "])),(l()(),t["\u0275eld"](8,0,null,null,58,"div",[["class","form"]],null,null,null,null,null)),(l()(),t["\u0275eld"](9,0,null,null,57,"form",[["novalidate",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngSubmit"],[null,"submit"],[null,"reset"]],function(l,n,e){var u=!0,a=l.component;return"submit"===n&&(u=!1!==t["\u0275nov"](l,11).onSubmit(e)&&u),"reset"===n&&(u=!1!==t["\u0275nov"](l,11).onReset()&&u),"ngSubmit"===n&&(u=!1!==a.submit(e)&&u),u},null,null)),t["\u0275did"](10,16384,null,0,u.t,[],null,null),t["\u0275did"](11,540672,null,0,u.g,[[8,null],[8,null]],{form:[0,"form"]},{ngSubmit:"ngSubmit"}),t["\u0275prd"](2048,null,u.c,null,[u.g]),t["\u0275did"](13,16384,null,0,u.n,[[4,u.c]],null,null),(l()(),t["\u0275eld"](14,0,null,null,21,"mat-form-field",[["class","mat-form-field"]],[[2,"mat-form-field-appearance-standard",null],[2,"mat-form-field-appearance-fill",null],[2,"mat-form-field-appearance-outline",null],[2,"mat-form-field-appearance-legacy",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-form-field-autofilled",null],[2,"mat-focused",null],[2,"mat-accent",null],[2,"mat-warn",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"_mat-animation-noopable",null]],null,null,_.b,_.a)),t["\u0275did"](15,7389184,null,7,C.b,[t.ElementRef,t.ChangeDetectorRef,[2,R.j],[2,x.c],[2,C.a],g.a,t.NgZone,[2,b.a]],null,null),t["\u0275qud"](335544320,1,{_control:0}),t["\u0275qud"](335544320,2,{_placeholderChild:0}),t["\u0275qud"](335544320,3,{_labelChild:0}),t["\u0275qud"](603979776,4,{_errorChildren:1}),t["\u0275qud"](603979776,5,{_hintChildren:1}),t["\u0275qud"](603979776,6,{_prefixChildren:1}),t["\u0275qud"](603979776,7,{_suffixChildren:1}),(l()(),t["\u0275eld"](23,0,[["Email",1]],1,9,"input",[["class","mat-input-element mat-form-field-autofill-control"],["formControlName","email"],["matInput",""],["maxlength","100"],["type","email"]],[[1,"maxlength",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"mat-input-server",null],[1,"id",0],[1,"placeholder",0],[8,"disabled",0],[8,"required",0],[1,"readonly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,e){var u=!0;return"input"===n&&(u=!1!==t["\u0275nov"](l,24)._handleInput(e.target.value)&&u),"blur"===n&&(u=!1!==t["\u0275nov"](l,24).onTouched()&&u),"compositionstart"===n&&(u=!1!==t["\u0275nov"](l,24)._compositionStart()&&u),"compositionend"===n&&(u=!1!==t["\u0275nov"](l,24)._compositionEnd(e.target.value)&&u),"blur"===n&&(u=!1!==t["\u0275nov"](l,31)._focusChanged(!1)&&u),"focus"===n&&(u=!1!==t["\u0275nov"](l,31)._focusChanged(!0)&&u),"input"===n&&(u=!1!==t["\u0275nov"](l,31)._onInput()&&u),u},null,null)),t["\u0275did"](24,16384,null,0,u.d,[t.Renderer2,t.ElementRef,[2,u.a]],null,null),t["\u0275did"](25,540672,null,0,u.i,[],{maxlength:[0,"maxlength"]},null),t["\u0275prd"](1024,null,u.j,function(l){return[l]},[u.i]),t["\u0275prd"](1024,null,u.k,function(l){return[l]},[u.d]),t["\u0275did"](28,671744,null,0,u.f,[[3,u.c],[6,u.j],[8,null],[6,u.k],[2,u.v]],{name:[0,"name"]},null),t["\u0275prd"](2048,null,u.l,null,[u.f]),t["\u0275did"](30,16384,null,0,u.m,[[4,u.l]],null,null),t["\u0275did"](31,999424,null,0,w.a,[t.ElementRef,g.a,[6,u.l],[2,u.o],[2,u.g],R.d,[8,null],y.a,t.NgZone],{placeholder:[0,"placeholder"],type:[1,"type"]},null),t["\u0275prd"](2048,[[1,4]],C.c,null,[w.a]),(l()(),t["\u0275eld"](33,0,null,7,2,"mat-hint",[["align","end"],["class","mat-hint"]],[[2,"mat-right",null],[1,"id",0],[1,"align",0]],null,null,null,null)),t["\u0275did"](34,16384,[[5,4]],0,C.e,[],{align:[0,"align"]},null),(l()(),t["\u0275ted"](35,null,["","/100"])),(l()(),t["\u0275eld"](36,0,null,null,22,"mat-form-field",[["class","textarea mat-form-field"]],[[2,"mat-form-field-appearance-standard",null],[2,"mat-form-field-appearance-fill",null],[2,"mat-form-field-appearance-outline",null],[2,"mat-form-field-appearance-legacy",null],[2,"mat-form-field-invalid",null],[2,"mat-form-field-can-float",null],[2,"mat-form-field-should-float",null],[2,"mat-form-field-hide-placeholder",null],[2,"mat-form-field-disabled",null],[2,"mat-form-field-autofilled",null],[2,"mat-focused",null],[2,"mat-accent",null],[2,"mat-warn",null],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"_mat-animation-noopable",null]],null,null,_.b,_.a)),t["\u0275did"](37,7389184,null,7,C.b,[t.ElementRef,t.ChangeDetectorRef,[2,R.j],[2,x.c],[2,C.a],g.a,t.NgZone,[2,b.a]],null,null),t["\u0275qud"](335544320,8,{_control:0}),t["\u0275qud"](335544320,9,{_placeholderChild:0}),t["\u0275qud"](335544320,10,{_labelChild:0}),t["\u0275qud"](603979776,11,{_errorChildren:1}),t["\u0275qud"](603979776,12,{_hintChildren:1}),t["\u0275qud"](603979776,13,{_prefixChildren:1}),t["\u0275qud"](603979776,14,{_suffixChildren:1}),(l()(),t["\u0275eld"](45,0,[["Content",1]],1,10,"textarea",[["cdkAutosizeMaxRows","7"],["cdkAutosizeMinRows","5"],["cdkTextareaAutosize",""],["class","cdk-textarea-autosize mat-input-element mat-form-field-autofill-control"],["formControlName","content"],["matInput",""],["maxlength","1000"],["rows","1"]],[[1,"maxlength",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null],[2,"mat-input-server",null],[1,"id",0],[1,"placeholder",0],[8,"disabled",0],[8,"required",0],[1,"readonly",0],[1,"aria-describedby",0],[1,"aria-invalid",0],[1,"aria-required",0]],[[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"],[null,"focus"]],function(l,n,e){var u=!0;return"input"===n&&(u=!1!==t["\u0275nov"](l,46)._handleInput(e.target.value)&&u),"blur"===n&&(u=!1!==t["\u0275nov"](l,46).onTouched()&&u),"compositionstart"===n&&(u=!1!==t["\u0275nov"](l,46)._compositionStart()&&u),"compositionend"===n&&(u=!1!==t["\u0275nov"](l,46)._compositionEnd(e.target.value)&&u),"input"===n&&(u=!1!==t["\u0275nov"](l,53)._noopInputHandler()&&u),"blur"===n&&(u=!1!==t["\u0275nov"](l,54)._focusChanged(!1)&&u),"focus"===n&&(u=!1!==t["\u0275nov"](l,54)._focusChanged(!0)&&u),"input"===n&&(u=!1!==t["\u0275nov"](l,54)._onInput()&&u),u},null,null)),t["\u0275did"](46,16384,null,0,u.d,[t.Renderer2,t.ElementRef,[2,u.a]],null,null),t["\u0275did"](47,540672,null,0,u.i,[],{maxlength:[0,"maxlength"]},null),t["\u0275prd"](1024,null,u.j,function(l){return[l]},[u.i]),t["\u0275prd"](1024,null,u.k,function(l){return[l]},[u.d]),t["\u0275did"](50,671744,null,0,u.f,[[3,u.c],[6,u.j],[8,null],[6,u.k],[2,u.v]],{name:[0,"name"]},null),t["\u0275prd"](2048,null,u.l,null,[u.f]),t["\u0275did"](52,16384,null,0,u.m,[[4,u.l]],null,null),t["\u0275did"](53,4603904,[["autosize",4]],0,y.b,[t.ElementRef,g.a,t.NgZone],{minRows:[0,"minRows"],maxRows:[1,"maxRows"],enabled:[2,"enabled"]},null),t["\u0275did"](54,999424,null,0,w.a,[t.ElementRef,g.a,[6,u.l],[2,u.o],[2,u.g],R.d,[8,null],y.a,t.NgZone],{placeholder:[0,"placeholder"]},null),t["\u0275prd"](2048,[[8,4]],C.c,null,[w.a]),(l()(),t["\u0275eld"](56,0,null,7,2,"mat-hint",[["align","end"],["class","mat-hint"]],[[2,"mat-right",null],[1,"id",0],[1,"align",0]],null,null,null,null)),t["\u0275did"](57,16384,[[12,4]],0,C.e,[],{align:[0,"align"]},null),(l()(),t["\u0275ted"](58,null,["","/1000"])),(l()(),t["\u0275eld"](59,0,null,null,1,"re-captcha",[["class","reCaptcha"]],[[1,"id",0]],[[null,"resolved"]],function(l,n,e){var t=!0;return"resolved"===n&&(t=!1!==l.component.verifyReCaptcha(e)&&t),t},S.b,S.a)),t["\u0275did"](60,4374528,null,0,F.RecaptchaComponent,[t.ElementRef,T.RecaptchaLoaderService,t.NgZone,[2,q.RECAPTCHA_SETTINGS]],{siteKey:[0,"siteKey"]},{resolved:"resolved"}),(l()(),t["\u0275eld"](61,0,null,null,5,"div",[["class","buttons"]],null,null,null,null,null)),(l()(),t["\u0275eld"](62,0,null,null,4,"button",[["mat-raised-button",""],["type","submit"]],[[8,"disabled",0],[2,"_mat-animation-noopable",null]],null,null,E.b,E.a)),t["\u0275did"](63,180224,null,0,I.b,[t.ElementRef,g.a,N.f,[2,b.a]],{disabled:[0,"disabled"]},null),(l()(),t["\u0275and"](16777216,null,0,1,null,A)),t["\u0275did"](65,16384,null,0,h.NgIf,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),t["\u0275ted"](66,0,[" "," "]))],function(l,n){var e=n.component;l(n,11,0,e.actionForm),l(n,25,0,"100"),l(n,28,0,"email"),l(n,31,0,t["\u0275inlineInterpolate"](1,"",null==e.translations?null:null==e.translations.support?null:e.translations.support.email,""),"email"),l(n,34,0,"end"),l(n,47,0,"1000"),l(n,50,0,"content"),l(n,53,0,"5","7",""),l(n,54,0,t["\u0275inlineInterpolate"](1,"",null==e.translations?null:null==e.translations.support?null:e.translations.support.description,"")),l(n,57,0,"end"),l(n,60,0,t["\u0275inlineInterpolate"](1,"",e.env.reCaptcha,"")),l(n,63,0,e.submitLoading),l(n,65,0,e.submitLoading)},function(l,n){var e=n.component;l(n,2,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.defaultText?null:e.translations.support.defaultText.one),l(n,5,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.defaultText?null:e.translations.support.defaultText.two),l(n,7,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.defaultText?null:e.translations.support.defaultText.three),l(n,9,0,t["\u0275nov"](n,13).ngClassUntouched,t["\u0275nov"](n,13).ngClassTouched,t["\u0275nov"](n,13).ngClassPristine,t["\u0275nov"](n,13).ngClassDirty,t["\u0275nov"](n,13).ngClassValid,t["\u0275nov"](n,13).ngClassInvalid,t["\u0275nov"](n,13).ngClassPending),l(n,14,1,["standard"==t["\u0275nov"](n,15).appearance,"fill"==t["\u0275nov"](n,15).appearance,"outline"==t["\u0275nov"](n,15).appearance,"legacy"==t["\u0275nov"](n,15).appearance,t["\u0275nov"](n,15)._control.errorState,t["\u0275nov"](n,15)._canLabelFloat,t["\u0275nov"](n,15)._shouldLabelFloat(),t["\u0275nov"](n,15)._hideControlPlaceholder(),t["\u0275nov"](n,15)._control.disabled,t["\u0275nov"](n,15)._control.autofilled,t["\u0275nov"](n,15)._control.focused,"accent"==t["\u0275nov"](n,15).color,"warn"==t["\u0275nov"](n,15).color,t["\u0275nov"](n,15)._shouldForward("untouched"),t["\u0275nov"](n,15)._shouldForward("touched"),t["\u0275nov"](n,15)._shouldForward("pristine"),t["\u0275nov"](n,15)._shouldForward("dirty"),t["\u0275nov"](n,15)._shouldForward("valid"),t["\u0275nov"](n,15)._shouldForward("invalid"),t["\u0275nov"](n,15)._shouldForward("pending"),!t["\u0275nov"](n,15)._animationsEnabled]),l(n,23,1,[t["\u0275nov"](n,25).maxlength?t["\u0275nov"](n,25).maxlength:null,t["\u0275nov"](n,30).ngClassUntouched,t["\u0275nov"](n,30).ngClassTouched,t["\u0275nov"](n,30).ngClassPristine,t["\u0275nov"](n,30).ngClassDirty,t["\u0275nov"](n,30).ngClassValid,t["\u0275nov"](n,30).ngClassInvalid,t["\u0275nov"](n,30).ngClassPending,t["\u0275nov"](n,31)._isServer,t["\u0275nov"](n,31).id,t["\u0275nov"](n,31).placeholder,t["\u0275nov"](n,31).disabled,t["\u0275nov"](n,31).required,t["\u0275nov"](n,31).readonly&&!t["\u0275nov"](n,31)._isNativeSelect||null,t["\u0275nov"](n,31)._ariaDescribedby||null,t["\u0275nov"](n,31).errorState,t["\u0275nov"](n,31).required.toString()]),l(n,33,0,"end"==t["\u0275nov"](n,34).align,t["\u0275nov"](n,34).id,null),l(n,35,0,t["\u0275nov"](n,23).value.length),l(n,36,1,["standard"==t["\u0275nov"](n,37).appearance,"fill"==t["\u0275nov"](n,37).appearance,"outline"==t["\u0275nov"](n,37).appearance,"legacy"==t["\u0275nov"](n,37).appearance,t["\u0275nov"](n,37)._control.errorState,t["\u0275nov"](n,37)._canLabelFloat,t["\u0275nov"](n,37)._shouldLabelFloat(),t["\u0275nov"](n,37)._hideControlPlaceholder(),t["\u0275nov"](n,37)._control.disabled,t["\u0275nov"](n,37)._control.autofilled,t["\u0275nov"](n,37)._control.focused,"accent"==t["\u0275nov"](n,37).color,"warn"==t["\u0275nov"](n,37).color,t["\u0275nov"](n,37)._shouldForward("untouched"),t["\u0275nov"](n,37)._shouldForward("touched"),t["\u0275nov"](n,37)._shouldForward("pristine"),t["\u0275nov"](n,37)._shouldForward("dirty"),t["\u0275nov"](n,37)._shouldForward("valid"),t["\u0275nov"](n,37)._shouldForward("invalid"),t["\u0275nov"](n,37)._shouldForward("pending"),!t["\u0275nov"](n,37)._animationsEnabled]),l(n,45,1,[t["\u0275nov"](n,47).maxlength?t["\u0275nov"](n,47).maxlength:null,t["\u0275nov"](n,52).ngClassUntouched,t["\u0275nov"](n,52).ngClassTouched,t["\u0275nov"](n,52).ngClassPristine,t["\u0275nov"](n,52).ngClassDirty,t["\u0275nov"](n,52).ngClassValid,t["\u0275nov"](n,52).ngClassInvalid,t["\u0275nov"](n,52).ngClassPending,t["\u0275nov"](n,54)._isServer,t["\u0275nov"](n,54).id,t["\u0275nov"](n,54).placeholder,t["\u0275nov"](n,54).disabled,t["\u0275nov"](n,54).required,t["\u0275nov"](n,54).readonly&&!t["\u0275nov"](n,54)._isNativeSelect||null,t["\u0275nov"](n,54)._ariaDescribedby||null,t["\u0275nov"](n,54).errorState,t["\u0275nov"](n,54).required.toString()]),l(n,56,0,"end"==t["\u0275nov"](n,57).align,t["\u0275nov"](n,57).id,null),l(n,58,0,t["\u0275nov"](n,45).value.length),l(n,59,0,t["\u0275nov"](n,60).id),l(n,62,0,t["\u0275nov"](n,63).disabled||null,"NoopAnimations"===t["\u0275nov"](n,63)._animationMode),l(n,66,0,null==e.translations?null:null==e.translations.common?null:e.translations.common.send)})}function D(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,10,"span",[],null,null,null,null,null)),(l()(),t["\u0275eld"](1,0,null,null,1,"div",[["class","title"]],null,null,null,null,null)),(l()(),t["\u0275ted"](2,null,[" "," "])),(l()(),t["\u0275eld"](3,0,null,null,7,"div",[["class","context"]],null,null,null,null,null)),(l()(),t["\u0275ted"](4,null,[" "," "])),(l()(),t["\u0275eld"](5,0,null,null,1,"b",[],null,null,null,null,null)),(l()(),t["\u0275ted"](6,null,["",""])),(l()(),t["\u0275ted"](-1,null,[". "])),(l()(),t["\u0275eld"](8,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t["\u0275eld"](9,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t["\u0275ted"](10,null,[" "," "]))],null,function(l,n){var e=n.component;l(n,2,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.confirmText?null:e.translations.support.confirmText.one),l(n,4,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.confirmText?null:e.translations.support.confirmText.two),l(n,6,0,e.email),l(n,10,0,null==e.translations?null:null==e.translations.support?null:null==e.translations.support.confirmText?null:e.translations.support.confirmText.three)})}function M(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,15,"div",[["class","innerBodyUser"]],null,null,null,null,null)),(l()(),t["\u0275eld"](1,0,null,null,14,"div",[["class","innerBodyContent"]],null,null,null,null,null)),(l()(),t["\u0275eld"](2,0,null,null,13,"div",[["class","pageWeb"]],null,null,null,null,null)),(l()(),t["\u0275eld"](3,0,null,null,12,"div",[["class","content"]],null,null,null,null,null)),(l()(),t["\u0275eld"](4,0,null,null,5,"div",[["class","back"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.goBack()&&t),t},null,null)),(l()(),t["\u0275eld"](5,0,null,null,2,"button",[["mat-icon-button",""]],[[8,"disabled",0],[2,"_mat-animation-noopable",null]],null,null,E.b,E.a)),t["\u0275did"](6,180224,null,0,I.b,[t.ElementRef,g.a,N.f,[2,b.a]],null,null),(l()(),t["\u0275eld"](7,0,null,0,0,"i",[["label","back"]],null,null,null,null,null)),(l()(),t["\u0275eld"](8,0,null,null,1,"div",[["class","text"]],null,null,null,null,null)),(l()(),t["\u0275ted"](9,null,["",""])),(l()(),t["\u0275eld"](10,0,null,null,1,"div",[["class","pageTitle"]],null,null,null,null,null)),(l()(),t["\u0275ted"](11,null,["",""])),(l()(),t["\u0275and"](16777216,null,null,1,null,P)),t["\u0275did"](13,16384,null,0,h.NgIf,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),t["\u0275and"](16777216,null,null,1,null,D)),t["\u0275did"](15,16384,null,0,h.NgIf,[t.ViewContainerRef,t.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,13,0,"default"==e.pageStatus),l(n,15,0,"completed"==e.pageStatus)},function(l,n){var e=n.component;l(n,5,0,t["\u0275nov"](n,6).disabled||null,"NoopAnimations"===t["\u0275nov"](n,6)._animationMode),l(n,9,0,null==e.translations?null:null==e.translations.common?null:e.translations.common.back),l(n,11,0,null==e.translations?null:null==e.translations.support?null:e.translations.support.title)})}function U(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"app-support",[],null,null,null,M,k)),t["\u0275did"](1,114688,null,0,c,[u.e,L.a,o.a,i.a,L.m,d.a,r.a,h.Location,s.a],null,null)],function(l,n){l(n,1,0)},null)}var j=t["\u0275ccf"]("app-support",c,U,{},{},[]),Z=e("M2Lx"),z=e("WH67"),H=e("uOf+"),V=e("ZYjt"),B=e("u7R8");e.d(n,"SupportModuleNgFactory",function(){return J});var J=t["\u0275cmf"](p,[],function(l){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[m.a,j]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,h.NgLocalization,h.NgLocaleLocalization,[t.LOCALE_ID,[2,h["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,T.RecaptchaLoaderService,T.RecaptchaLoaderService,[t.PLATFORM_ID,[2,T.RECAPTCHA_LANGUAGE],[2,T.RECAPTCHA_BASE_URL],[2,T.RECAPTCHA_NONCE]]),t["\u0275mpd"](4608,u.u,u.u,[]),t["\u0275mpd"](4608,u.e,u.e,[]),t["\u0275mpd"](4608,Z.c,Z.c,[]),t["\u0275mpd"](4608,R.d,R.d,[]),t["\u0275mpd"](1073742336,h.CommonModule,h.CommonModule,[]),t["\u0275mpd"](1073742336,L.q,L.q,[[2,L.w],[2,L.m]]),t["\u0275mpd"](1073742336,z.RecaptchaCommonModule,z.RecaptchaCommonModule,[]),t["\u0275mpd"](1073742336,H.RecaptchaModule,H.RecaptchaModule,[]),t["\u0275mpd"](1073742336,u.s,u.s,[]),t["\u0275mpd"](1073742336,u.h,u.h,[]),t["\u0275mpd"](1073742336,u.q,u.q,[]),t["\u0275mpd"](1073742336,x.a,x.a,[]),t["\u0275mpd"](1073742336,R.n,R.n,[[2,R.f],[2,V.h]]),t["\u0275mpd"](1073742336,g.b,g.b,[]),t["\u0275mpd"](1073742336,R.x,R.x,[]),t["\u0275mpd"](1073742336,I.c,I.c,[]),t["\u0275mpd"](1073742336,B.a,B.a,[]),t["\u0275mpd"](1073742336,f.c,f.c,[]),t["\u0275mpd"](1073742336,y.c,y.c,[]),t["\u0275mpd"](1073742336,Z.d,Z.d,[]),t["\u0275mpd"](1073742336,C.d,C.d,[]),t["\u0275mpd"](1073742336,w.b,w.b,[]),t["\u0275mpd"](1073742336,p,p,[]),t["\u0275mpd"](1024,L.k,function(){return[[{path:"",component:c}]]},[])])})}}]);