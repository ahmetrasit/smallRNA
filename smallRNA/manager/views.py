from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
import os

@csrf_exempt
def homepage(request):
	return render(request, 'homepage.html', {'user':request.user, 'genotype_options':['wt', 'mut'], 'sample_type_options':['input', 'IP']})

#@login_required
@csrf_exempt
def uploadFASTQ(request):
    if request.method == 'POST':
        for i in range(len(request.FILES.getlist('filesToUpload'))):
            file = request.FILES.getlist('filesToUpload')[i]
            filename = str(file)
            handle_uploaded_file(file, filename, request.user.username)
    return HttpResponse()


@csrf_exempt
def handle_uploaded_file(f, filename, username):
    print(os.getcwd(), os.listdir('./'))
    try:
        print(os.getcwd(), os.listdir('./'))
        os.makedirs('static/upload/' + username)
        os.makedirs('static/upload/' + username + '/' + 'csv')
        os.makedirs('static/upload/' + username + '/' + 'userdata')
    except:
        pass
    with open('static/upload/' + username + '/'+ filename, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
