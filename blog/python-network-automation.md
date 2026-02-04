# Automating Network Configuration with Python: A Practical Guide

**Published:** September 12, 2024
**Category:** Network Automation

## Introduction

Manual network configuration doesn't scale. As infrastructure grows, the risk of human error increases exponentially. Python has emerged as the go-to language for network automation, offering powerful libraries and a gentler learning curve than traditional scripting languages.

## Why Python for Network Automation?

- **Rich ecosystem**: Libraries like Netmiko, NAPALM, and Nornir
- **Readability**: Easy for network engineers to learn
- **Cross-platform**: Works on Linux, Windows, and macOS
- **API integration**: Perfect for REST API interactions

## Getting Started with Netmiko

Netmiko simplifies SSH connections to network devices:

```python
from netmiko import ConnectHandler

device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'secure_password',
    'secret': 'enable_password',
}

connection = ConnectHandler(**device)
connection.enable()

output = connection.send_command('show ip interface brief')
print(output)

connection.disconnect()
```

## Configuration Management with NAPALM

NAPALM provides vendor-agnostic network automation:

```python
from napalm import get_network_driver

driver = get_network_driver('ios')
device = driver(
    hostname='192.168.1.1',
    username='admin',
    password='secure_password'
)

device.open()

# Load configuration
device.load_merge_candidate(filename='config.txt')

# Compare changes
diff = device.compare_config()
print(diff)

# Commit if looks good
if input("Apply changes? (y/n): ").lower() == 'y':
    device.commit_config()
else:
    device.discard_config()

device.close()
```

## Parallel Execution with Nornir

Automate across hundreds of devices simultaneously:

```python
from nornir import InitNornir
from nornir_netmiko.tasks import netmiko_send_command
from nornir_utils.plugins.functions import print_result

nr = InitNornir(config_file="config.yaml")

result = nr.run(
    task=netmiko_send_command,
    command_string="show version"
)

print_result(result)
```

### Configuration File

```yaml
# config.yaml
inventory:
  plugin: SimpleInventory
  options:
    host_file: "hosts.yaml"
    group_file: "groups.yaml"

runner:
  plugin: threaded
  options:
    num_workers: 20
```

## Real-World Use Cases

### 1. Backup All Device Configurations

```python
import os
from datetime import datetime
from netmiko import ConnectHandler

def backup_config(device_info):
    connection = ConnectHandler(**device_info)
    output = connection.send_command('show running-config')

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"backups/{device_info['host']}_{timestamp}.cfg"

    os.makedirs('backups', exist_ok=True)
    with open(filename, 'w') as f:
        f.write(output)

    connection.disconnect()
    return filename

devices = [
    {'device_type': 'cisco_ios', 'host': '192.168.1.1', 'username': 'admin', 'password': 'pass'},
    {'device_type': 'cisco_ios', 'host': '192.168.1.2', 'username': 'admin', 'password': 'pass'},
]

for device in devices:
    try:
        backup_file = backup_config(device)
        print(f"Backed up {device['host']} to {backup_file}")
    except Exception as e:
        print(f"Failed to backup {device['host']}: {e}")
```

### 2. Audit VLAN Configuration

```python
def audit_vlans(device):
    connection = ConnectHandler(**device)
    output = connection.send_command('show vlan brief')

    vlans = []
    for line in output.split('\n')[2:]:  # Skip header
        if line.strip():
            vlan_id = line.split()[0]
            if vlan_id.isdigit():
                vlans.append(int(vlan_id))

    connection.disconnect()
    return vlans

# Compare VLANs across devices
expected_vlans = [10, 20, 30, 40]

for device in devices:
    found_vlans = audit_vlans(device)
    missing = set(expected_vlans) - set(found_vlans)
    extra = set(found_vlans) - set(expected_vlans)

    if missing:
        print(f"{device['host']}: Missing VLANs {missing}")
    if extra:
        print(f"{device['host']}: Extra VLANs {extra}")
```

### 3. Generate Configuration from Templates

Use Jinja2 for template-based configuration:

```python
from jinja2 import Template

template = Template("""
interface {{ interface }}
 description {{ description }}
 switchport mode access
 switchport access vlan {{ vlan }}
 spanning-tree portfast
 no shutdown
""")

config = template.render(
    interface='GigabitEthernet0/1',
    description='Server Port',
    vlan=10
)

print(config)
```

## Error Handling and Logging

Always implement robust error handling:

```python
import logging
from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, NetmikoAuthenticationException

logging.basicConfig(
    filename='network_automation.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def safe_connect(device):
    try:
        connection = ConnectHandler(**device)
        logging.info(f"Successfully connected to {device['host']}")
        return connection
    except NetmikoTimeoutException:
        logging.error(f"Timeout connecting to {device['host']}")
    except NetmikoAuthenticationException:
        logging.error(f"Authentication failed for {device['host']}")
    except Exception as e:
        logging.error(f"Unexpected error with {device['host']}: {e}")
    return None
```

## Best Practices

1. **Use environment variables**: Never hardcode credentials
2. **Implement logging**: Track all changes and errors
3. **Test in lab first**: Always validate scripts in non-production
4. **Version control**: Use Git for your automation scripts
5. **Idempotency**: Scripts should be safe to run multiple times
6. **Documentation**: Comment your code and maintain README files

## Security Considerations

```python
import os
from getpass import getpass

# Use environment variables
username = os.environ.get('NET_USERNAME')
password = os.environ.get('NET_PASSWORD')

# Or prompt securely
if not password:
    password = getpass("Enter password: ")

# Use SSH keys when possible
device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': username,
    'use_keys': True,
    'key_file': '~/.ssh/id_rsa',
}
```

## Conclusion

Python network automation transforms repetitive, error-prone manual tasks into reliable, auditable, and scalable operations. Start small—automate one task, like configuration backups—then gradually expand your automation coverage.

The initial investment in learning and building automation pays dividends in reduced errors, faster deployments, and better sleep at night knowing your network configurations are consistent and recoverable.

## Further Resources

- **Netmiko Documentation**: https://github.com/ktbyers/netmiko
- **NAPALM Documentation**: https://napalm.readthedocs.io
- **Nornir Documentation**: https://nornir.readthedocs.io
- **Network to Code**: https://networktocode.com/blog/

Happy automating!
