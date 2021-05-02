from django.shortcuts import render, redirect
from task_creator.bitrix24 import BitrixIntegrator 

def index(request):
    return render(request, 'index.html')

def task_admin(request):
    auth_header = request.headers.get("Authorization")
    if auth_header:
        token = auth_header.replace("Token ", "")
        print(token)
        if token:
            bitrix_id = BitrixIntegrator.get_id_from_token(token)
            if bitrix_id in [26]:
                print("index")
                return render(request, "index.html")
        print("redirect")
    return redirect('/')
    
