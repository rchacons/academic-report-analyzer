import json
import multiprocessing
import os
from dotenv import load_dotenv

load_dotenv()

workers_per_core_str = os.getenv("WORKERS_PER_CORE")
max_workers_str = os.getenv("MAX_WORKERS")
use_max_workers = None

if max_workers_str:
    use_max_workers = int(max_workers_str)

web_concurrency_str = os.getenv("WEB_CONCURRENCY", None)
host = os.getenv("HOST")
port = os.getenv("PORT")
bind_env = os.getenv("BIND", None)
use_loglevel = os.getenv("LOG_LEVEL")

if bind_env:
    use_bind = bind_env
else:
    use_bind = f"{host}:{port}"
    
# Calculate the number of worker processes
cores = multiprocessing.cpu_count()
workers_per_core = float(workers_per_core_str)
default_web_concurrency = workers_per_core * cores

if web_concurrency_str:
    web_concurrency = int(web_concurrency_str)
    assert web_concurrency > 0
else:
    web_concurrency = max(int(default_web_concurrency), 2)
    if use_max_workers:
        web_concurrency = min(web_concurrency, use_max_workers)

accesslog_var = os.getenv("ACCESS_LOG", "-")
use_accesslog = accesslog_var or None
errorlog_var = os.getenv("ERROR_LOG", "-")
use_errorlog = errorlog_var or None
graceful_timeout_str = os.getenv("GRACEFUL_TIMEOUT")
timeout_str = os.getenv("TIMEOUT")
keepalive_str = os.getenv("KEEP_ALIVE")

# Gunicorn config variables
worker_class = "app.workers.ConfigurableWorker"
loglevel = use_loglevel
workers = web_concurrency
bind = use_bind
errorlog = use_errorlog
worker_tmp_dir = "/tmp/shm"

if not os.path.exists(worker_tmp_dir):
    os.makedirs(worker_tmp_dir)


accesslog = use_accesslog

# The maximum number of seconds to wait for requests on a Keep-Alive connection.
graceful_timeout = int(graceful_timeout_str)

# The maximum number of seconds to wait for a response from the worker.
timeout = int(timeout_str)

# The number of seconds to wait for the next request on a Keep-Alive HTTP connection.
keepalive = int(keepalive_str)

# For debugging and testing , a dictionary to hold the configuration data for logging.
log_data = {
    "loglevel": loglevel,
    "workers": workers,
    "bind": bind,
    "graceful_timeout": graceful_timeout,
    "timeout": timeout,
    "keepalive": keepalive,
    "errorlog": errorlog,
    "accesslog": accesslog,
    # Additional, non-gunicorn variables
    "workers_per_core": workers_per_core,
    "use_max_workers": use_max_workers,
    "host": host,
    "port": port,
}

print(json.dumps(log_data))