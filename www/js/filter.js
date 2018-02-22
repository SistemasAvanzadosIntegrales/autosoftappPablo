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
    this.input.keyup(function(){
      self.filter();
    });
  },
  filter: function(){
    var self = this;
    self.table.find('tr').each(function(i, tr){
      var word = self.input.val().toLowerCase();
      tr = $(tr);
      tr.removeClass('hide');
      if (word)
      {
        var tr = $(tr);
        if(tr.text().toLowerCase().search(word) < 0)
        {
          tr.addClass('hide');
        }
      }
    });
  }
}
