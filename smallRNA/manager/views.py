from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from manager.models import *
import os
import re

def homepage(request):
	workflows = serializers.serialize("json", Workflow.objects.all())
	print(workflows)
	return render(request, 'homepage.html', {'user':request.user, 'genotype_options':['wt', 'mut'], 'sample_type_options':['input', 'IP'], 'workflows':workflows})


@csrf_exempt
def createProcess(request):
    print(request.POST.keys())
    print('db', Workflow.objects.all())
    if request.POST['bashProcessID'].strip() not in Workflow.objects.values_list('process_id', flat=True):
        try:
            bash_process = Workflow(
				process_id = request.POST['bashProcessID'].strip(),
    			name = request.POST['bashProcessName'].strip(),
                category = 'bash',
                status = 'approved',
                inputs = getInputs(request.POST['bashProcessScript'].strip().lower()),
                outputs = getOutputs(request.POST['bashProcessScript'].strip().lower()),
                parameters = getParameters(request.POST['bashProcessScript'].strip().lower()),
                description = request.POST['bashProcessDescription'].strip(),
                content = request.POST['bashProcessScript'].strip(),
                created_by = request.user.username
    		)
            bash_process.save()
            return HttpResponse('<div class="btn btn-success btn-block">Bash Process Successfully Created</div>')
        except Exception as e:
            return HttpResponse('<div class="btn btn-danger btn-block">There is a problem on server side!'+str(e)+'</div>')
    else:
        return HttpResponse('<div class="btn btn-danger btn-block">There is already a process with the same id!</div>')



def getInputs(script):
	inputs = []
	io_types = {'f':'file', 'i':'html_input', 'd':'database', 's':'select'}
	for item in re.compile("\s+").split(script):
		match = re.match("<([a-z])_([a-z-]+)_([a-z_-]+)", item)
		if match:
			io_type = io_types[match.group(1)]
			data_type = match.group(2)
			data_name = match.group(3)
			print('inputs', io_type, data_type, data_name)
			inputs.append(':'.join([io_type, data_type, data_name]))
	return ';'.join(inputs)


def getOutputs(script):
	outputs = []
	io_types = {'f':'file', 'i':'html_input', 'd':'database', 's':'select'}
	for item in re.compile("\s+").split(script):
		match = re.match(">([a-z])_([a-z-]+)_([a-z_-]+)", item)
		if match:
			io_type = io_types[match.group(1)]
			data_type = match.group(2)
			data_name = match.group(3)
			print('outputs', io_type, data_type, data_name)
			outputs.append(':'.join([io_type, data_type, data_name]))
	return ';'.join(outputs)


def getParameters(script):
	parameters= []
	for item in re.compile("\s+").split(script):
		match = re.match("-p_([a-z-]+)", item)
		if match:
			parameter_type = match.group(1)
			print('parameter',parameter_type)
			parameters.append(parameter_type)
	return ';'.join(parameters)





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
