var Filter = {
  constructor: function(button, input, table){
    this.table = table;
    this.input = input;
    this.button = button;
    this.setEvdents();
  },
  setEvdents: function(){
    var self = this;
    this.button.click(function(){
      self.filter();
    });
  },
  filter: function(){
    var self = this;
      self.table.find('tr').each(function(i, tr){
        var word = self.input.val();
        var tr = $(tr);
        if(tr.text().search(word) < 0){
          tr.addClass('hide');
        }

    })
  }
}
