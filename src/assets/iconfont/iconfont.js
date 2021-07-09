!(function(e) {
  var t,
    n,
    o,
    i,
    l,
    d,
    a =
      '<svg><symbol id="icon-bigData-chenggong" viewBox="0 0 1024 1024"><path d="M512 64C262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448-198.4-448-448-448z m-32 582.4l-44.8 44.8-160-153.6 44.8-51.2 115.2 115.2L704 332.8l44.8 44.8-268.8 268.8z" fill="#19BE6B" ></path></symbol><symbol id="icon-bigData-quxiao" viewBox="0 0 1024 1024"><path d="M512 64C268.8 64 64 268.8 64 512s198.4 448 448 448 448-198.4 448-448-198.4-448-448-448z m179.2 582.4l-44.8 44.8L512 556.8l-134.4 134.4-44.8-44.8L467.2 512 332.8 377.6l44.8-44.8L512 467.2l134.4-134.4 44.8 44.8L556.8 512l134.4 134.4z" fill="#C4C6CC" ></path></symbol></svg>',
    c = (c = document.getElementsByTagName('script'))[
      c.length - 1
    ].getAttribute('data-injectcss')
  if (c && !e.__iconfont__svg__cssinject__) {
    e.__iconfont__svg__cssinject__ = !0
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
      )
    } catch (e) {
      console && console.log(e)
    }
  }
  function s() {
    l || ((l = !0), o())
  }
  ;(t = function() {
    var e, t, n, o
    ;((o = document.createElement('div')).innerHTML = a),
      (a = null),
      (n = o.getElementsByTagName('svg')[0]) &&
        (n.setAttribute('aria-hidden', 'true'),
        (n.style.position = 'absolute'),
        (n.style.width = 0),
        (n.style.height = 0),
        (n.style.overflow = 'hidden'),
        (e = n),
        (t = document.body).firstChild
          ? ((o = e), (n = t.firstChild).parentNode.insertBefore(o, n))
          : t.appendChild(e))
  }),
    document.addEventListener
      ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
        ? setTimeout(t, 0)
        : ((n = function() {
            document.removeEventListener('DOMContentLoaded', n, !1), t()
          }),
          document.addEventListener('DOMContentLoaded', n, !1))
      : document.attachEvent &&
        ((o = t),
        (i = e.document),
        (l = !1),
        (d = function() {
          try {
            i.documentElement.doScroll('left')
          } catch (e) {
            return void setTimeout(d, 50)
          }
          s()
        })(),
        (i.onreadystatechange = function() {
          'complete' == i.readyState && ((i.onreadystatechange = null), s())
        }))
})(window)
