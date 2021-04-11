import requests
import os

class BitrixIntegrator():

    def __init__(self, token = None):

        self.main_url = token if token else os.environ.get('BITRIX_KEY')
        self.users_dict = {}
        self.user_id_dict = {}
        self.id_list = []

    def build_query(self, method, filterParam = None, selectParam = None):

        pre_final_query = f'{self.main_url}/{method}?'
        if filterParam:
            filter_query = '&'.join([f'filter[{f[0]}]={f[1]}' for f in filterParam])
        if selectParam:
            select_query = 'select=' + '&'.join([field for field in selectParam])
        if selectParam and filterParam:
            final_query = filter_query+'&'+select_query
            return pre_final_query+final_query
        elif filterParam:
            return pre_final_query+filter_query
        else:
            return pre_final_query+select_query if selectParam else pre_final_query

    def execute_method(self, method, filterParam = None, selectParam = None):

        request_url = self.build_query(method, filterParam, selectParam)
        request = requests.get(request_url)
        if request.status_code == 200:
            response = request.json()
            return response
        else:
            return 'status 404'

    def get_next(self, query, start, cache):

        request = requests.get(query+f'&start={start}')
        if request.status_code == 200:
            response = request.json()
            cache.extend(response['result']['tasks'])
            next_ = response.get('next')
            if next_:
                self.get_next(query, next_, cache)
        else:
            return 'status 404'

    def get_all_users(self, selectParam):

        method = 'user.get'
        users_list = [user for user in self.execute_method('user.get', filterParam=[['ACTIVE', True]])['result']]
        if selectParam:
            users_list = [[user[field] for field in selectParam] for user in users_list]
        return users_list

    def get_all_tasks(self, filterParam = None, selectParam = None):

        cache_tasks = []
        query = self.build_query('tasks.task.list', filterParam, selectParam)
        self.get_next(query, 0, cache_tasks)
        return cache_tasks

    def get_all_user_tasks(self, id_):
        print("AVAILABLE")
        tasks = self.get_available_groups()
        print(tasks)
        print(len(tasks.get('result')))
        for t in tasks.get('result'):
            print(t.get('ID'), t.get('NAME'), t.get('ACTIVE'), t.get('VISIBLE'), 'CLOSED:', t.get('CLOSED'))
        cache_tasks = []
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '2'], ['RESPONSIBLE_ID', id_]])
        self.get_next(query, 0, cache_tasks)
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '3'], ['RESPONSIBLE_ID', id_]])
        self.get_next(query, 0, cache_tasks)
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '2'], ['ACCOMPLICE', id_], ['!RESPONSIBLE_ID', id_]])
        self.get_next(query, 0, cache_tasks)
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '3'], ['ACCOMPLICE', id_], ['!RESPONSIBLE_ID', id_]])
        self.get_next(query, 0, cache_tasks)
        return cache_tasks

    def add_task(self, fields):
        method_url = f'{self.main_url}/tasks.task.add?'
        fields = '&'.join([f'fields[{key}]={value}' for key, value in fields.items()])
        request_url = method_url + fields + '&fields[AUDITORS][0]=26&fields[AUDITORS][1]=1&fields[ALLOW_TIME_TRACKING]=Y'
        req = requests.get(request_url)
        json_ = req.json()
        return json_

    def get_task_by_id(self, task_id):
        method_url = f'{self.main_url}/tasks.task.get?taskId={task_id}'
        req = requests.get(method_url)
        return req.json()

    def save_time_to_bitrix(self, userId, taskId, starting_time, total_time):
        created_date = starting_time.strftime("%Y-%m-%d %H:%M:%S")
        request_url = f'{self.main_url}/task.elapseditem.add?taskId={taskId}&ARFIELDS[USER_ID]={userId}&ARFIELDS[CREATED_DATE]={created_date}&ARFIELDS[SECONDS]={int(total_time)}&ARFIELDS[COMMENT_TEXT]='
        request = requests.get(request_url)
        response = request.json()

    def add_comment(self, task_id, comment):
        method_url = f'{self.main_url}/task.commentitem.add?TASKID={task_id}&FIELDS[POST_MESSAGE]={comment}'
        req = requests.get(method_url)
        response = req.json()

    def get_task_fields(self):
        method_url = f'{self.main_url}/tasks.task.getfields'
        req = requests.get(method_url)
        response = req.json()
        return response

    
    def get_active_groups(self):
        method_url = f'{self.main_url}/sonet_group.get?IS_ADMIN=Y&FILTER[%CLOSED]=N&FILTER[%ACTIVE]=Y'
        req = requests.get(method_url)
        response = req.json()
        return response
    
    def check_key(self, token):
        try:
            req = requests.get(f'{token}/profile')
            response = req.json()
            if response.get('error'):
                return None
            else:
                return int(response.get('result').get('ID'))
        except requests.exceptions.MissingSchema:
            return None
        except requests.exceptions.ConnectionError:
            return None
        

if __name__ == "__main__":
    bitrix = BitrixIntegrator()
    

