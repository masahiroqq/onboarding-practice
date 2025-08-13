# ネットワーク機器周りの情報


### Tips
- ssh コマンドすると下記エラーが出る

```
➜  ~ ssh ngg@10.0.1.14
Unable to negotiate with 10.0.1.14 port 22: no matching key exchange method found. Their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1
```
[原因]  
古い鍵暗号方式を装置が使用しているからです。    
同じ階層にある "ssh.txt" を参照して解決してください。  
