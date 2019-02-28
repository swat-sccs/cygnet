from django.conf import settings
from django.conf.urls import include, url
from django.contrib.auth.views import logout
from django.views.static import serve
import views as cygnet_views
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = [
    url(r'^$', cygnet_views.home, name='home'),
    url(r'^home/$', cygnet_views.home, name='home'),
    url(r'^backend/', cygnet_views.backend, name='backend'),

    url(r'^accounts/login/$', cygnet_views.login, name='login'),
    url(r'^accounts/logout/$',logout ,name='logout'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
]

if settings.DEBUG:
    urlpatterns += [
        url(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
   ]
